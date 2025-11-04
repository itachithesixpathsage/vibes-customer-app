import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, PromoCode } from '@types/cart';
import { mockDataService } from './mockDataService';

class CartService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCart(): Promise<Cart> {
    try {
      if (__DEV__) {
        await this.delay(400);

        // Mock empty cart
        return {
          id: 'cart-' + Date.now(),
          userId: 'user-1',
          restaurantId: '',
          restaurant: {} as any,
          items: [],
          subtotal: 0,
          deliveryFee: 0,
          serviceFee: 0,
          taxes: 0,
          discount: 0,
          tip: 0,
          total: 0,
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Production API call would go here
      const response = await fetch('/api/cart');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch cart');
    }
  }

  async addToCart(request: AddToCartRequest): Promise<Cart> {
    try {
      if (__DEV__) {
        await this.delay(600);

        // Mock add to cart
        const mockCart = await this.getCart();
        const menuItem = mockDataService.getMenuItemById(request.menuItemId);

        if (!menuItem) {
          throw new Error('Menu item not found');
        }

        const cartItem: CartItem = {
          id: 'cart-item-' + Date.now(),
          menuItemId: request.menuItemId,
          menuItem,
          quantity: request.quantity,
          specialInstructions: request.specialInstructions,
          customizations: request.customizations || [],
          totalPrice: menuItem.price * request.quantity,
          addedAt: new Date().toISOString(),
        };

        mockCart.items.push(cartItem);
        mockCart.subtotal += cartItem.totalPrice;
        mockCart.total = mockCart.subtotal + mockCart.deliveryFee + mockCart.taxes;

        return mockCart;
      }

      // Production API call would go here
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add item to cart');
    }
  }

  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<Cart> {
    try {
      if (__DEV__) {
        await this.delay(500);

        const mockCart = await this.getCart();
        const itemIndex = mockCart.items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
          throw new Error('Cart item not found');
        }

        const item = mockCart.items[itemIndex];

        // Update item properties
        if (data.quantity !== undefined) {
          mockCart.subtotal -= item.totalPrice;
          item.quantity = data.quantity;
          item.totalPrice = item.menuItem.price * data.quantity;
          mockCart.subtotal += item.totalPrice;
        }

        if (data.customizations) {
          item.customizations = data.customizations;
        }

        if (data.specialInstructions !== undefined) {
          item.specialInstructions = data.specialInstructions;
        }

        mockCart.total = mockCart.subtotal + mockCart.deliveryFee + mockCart.taxes;
        mockCart.updatedAt = new Date().toISOString();

        return mockCart;
      }

      // Production API call would go here
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update cart item');
    }
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    try {
      if (__DEV__) {
        await this.delay(400);

        const mockCart = await this.getCart();
        const itemIndex = mockCart.items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
          throw new Error('Cart item not found');
        }

        const item = mockCart.items[itemIndex];
        mockCart.subtotal -= item.totalPrice;
        mockCart.items.splice(itemIndex, 1);
        mockCart.total = mockCart.subtotal + mockCart.deliveryFee + mockCart.taxes;
        mockCart.updatedAt = new Date().toISOString();

        return mockCart;
      }

      // Production API call would go here
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to remove item from cart');
    }
  }

  async clearCart(): Promise<Cart> {
    try {
      if (__DEV__) {
        await this.delay(300);

        const mockCart = await this.getCart();
        mockCart.items = [];
        mockCart.subtotal = 0;
        mockCart.total = 0;
        mockCart.updatedAt = new Date().toISOString();

        return mockCart;
      }

      // Production API call would go here
      const response = await fetch('/api/cart', { method: 'DELETE' });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to clear cart');
    }
  }

  async applyPromoCode(code: string, restaurantId: string): Promise<Cart> {
    try {
      if (__DEV__) {
        await this.delay(600);

        const mockCart = await this.getCart();

        // Mock promo code validation
        if (code === 'SAVE10') {
          const promoCode: PromoCode = {
            id: 'promo-1',
            code: 'SAVE10',
            type: 'percentage',
            value: 10,
            minOrderAmount: 20,
            maxDiscountAmount: 5,
            applicableRestaurants: [restaurantId],
            applicableItems: [],
            usageLimit: 100,
            usageCount: 25,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            isActive: true,
          };

          const discountAmount = Math.min(mockCart.subtotal * 0.1, 5);
          mockCart.discount = discountAmount;
          mockCart.total = mockCart.subtotal + mockCart.deliveryFee + mockCart.taxes - discountAmount;
          mockCart.promoCode = promoCode;
          mockCart.updatedAt = new Date().toISOString();
        } else {
          throw new Error('Invalid promo code');
        }

        return mockCart;
      }

      // Production API call would go here
      const response = await fetch('/api/cart/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, restaurantId }),
      });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to apply promo code');
    }
  }

  async removePromoCode(): Promise<Cart> {
    try {
      if (__DEV__) {
        await this.delay(300);

        const mockCart = await this.getCart();
        mockCart.discount = 0;
        mockCart.promoCode = null;
        mockCart.total = mockCart.subtotal + mockCart.deliveryFee + mockCart.taxes;
        mockCart.updatedAt = new Date().toISOString();

        return mockCart;
      }

      // Production API call would go here
      const response = await fetch('/api/cart/promo', { method: 'DELETE' });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to remove promo code');
    }
  }

  async updateTip(tip: number): Promise<Cart> {
    try {
      if (__DEV__) {
        await this.delay(300);

        const mockCart = await this.getCart();
        mockCart.tip = tip;
        mockCart.total = mockCart.subtotal + mockCart.deliveryFee + mockCart.taxes + tip - mockCart.discount;
        mockCart.updatedAt = new Date().toISOString();

        return mockCart;
      }

      // Production API call would go here
      const response = await fetch('/api/cart/tip', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tip }),
      });
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update tip');
    }
  }

  async validateCart(): Promise<any> {
    try {
      if (__DEV__) {
        await this.delay(500);

        // Mock cart validation
        return {
          isValid: true,
          errors: [],
          warnings: [],
        };
      }

      // Production API call would go here
      const response = await fetch('/api/cart/validate');
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Cart validation failed');
    }
  }
}

export const cartService = new CartService();
export default cartService;