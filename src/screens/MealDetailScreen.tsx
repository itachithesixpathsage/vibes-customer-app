import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Input } from '@components/common';
import { theme } from '@theme/index';
import { RootState } from '@store/index';
import { addToCart } from '@store/slices/cartSlice';
import { formatCurrency } from '@utils/index';
import { MenuItem } from '@types/index';

const { width, height } = Dimensions.get('window');

interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

interface CustomizationGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple'; // single choice or multiple choice
  required: boolean;
  options: CustomizationOption[];
}

const MealDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = theme;

  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  // Get menu item from route params or use mock data
  const menuItem = route.params?.menuItem as MenuItem || {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, basil on wood-fired dough. Made with authentic Italian ingredients including San Marzano tomatoes, fresh mozzarella di bufala, and hand-stretched dough. Baked in our wood-fired oven for that perfect crispy crust.',
    price: 14.99,
    category: 'pizza',
    image: 'https://example.com/pizza.jpg',
    ingredients: ['mozzarella', 'tomato sauce', 'fresh basil', 'olive oil', 'sea salt', 'oregano'],
    allergens: ['dairy', 'gluten'],
    nutritionInfo: {
      calories: 280,
      protein: 12,
      carbs: 35,
      fat: 10,
      fiber: 2,
      sodium: 680,
    },
    isVegetarian: true,
    isPopular: true,
    preparationTime: 15,
    available: true,
    spicyLevel: 0, // 0-5 scale
  };

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizations, setCustomizations] = useState<CustomizationGroup[]>([]);
  const [totalPrice, setTotalPrice] = useState(menuItem.price);

  useEffect(() => {
    loadCustomizations();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [quantity, customizations]);

  const loadCustomizations = () => {
    const mockCustomizations: CustomizationGroup[] = [
      {
        id: 'size',
        name: 'Size',
        type: 'single',
        required: true,
        options: [
          { id: 'small', name: 'Small (10")', price: 0, selected: false },
          { id: 'medium', name: 'Medium (12")', price: 3, selected: true },
          { id: 'large', name: 'Large (14")', price: 6, selected: false },
        ],
      },
      {
        id: 'crust',
        name: 'Crust',
        type: 'single',
        required: true,
        options: [
          { id: 'thin', name: 'Thin Crust', price: 0, selected: true },
          { id: 'thick', name: 'Thick Crust', price: 0, selected: false },
          { id: 'stuffed', name: 'Stuffed Crust', price: 2, selected: false },
          { id: 'gluten-free', name: 'Gluten Free', price: 3, selected: false },
        ],
      },
      {
        id: 'extra-toppings',
        name: 'Extra Toppings',
        type: 'multiple',
        required: false,
        options: [
          { id: 'extra-cheese', name: 'Extra Cheese', price: 2.5, selected: false },
          { id: 'pepperoni', name: 'Pepperoni', price: 1.5, selected: false },
          { id: 'mushrooms', name: 'Fresh Mushrooms', price: 1, selected: false },
          { id: 'olives', name: 'Black Olives', price: 1, selected: false },
          { id: 'peppers', name: 'Bell Peppers', price: 1, selected: false },
          { id: 'onions', name: 'Red Onions', price: 0.5, selected: false },
        ],
      },
      {
        id: 'sides',
        name: 'Add Sides',
        type: 'multiple',
        required: false,
        options: [
          { id: 'garlic-bread', name: 'Garlic Bread', price: 4.99, selected: false },
          { id: 'caesar-salad', name: 'Caesar Salad', price: 6.99, selected: false },
          { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', price: 5.99, selected: false },
          { id: 'wings', name: 'Chicken Wings', price: 8.99, selected: false },
        ],
      },
    ];
    setCustomizations(mockCustomizations);
  };

  const calculateTotalPrice = () => {
    let customizationsPrice = 0;

    customizations.forEach(group => {
      group.options.forEach(option => {
        if (option.selected) {
          customizationsPrice += option.price;
        }
      });
    });

    setTotalPrice((menuItem.price + customizationsPrice) * quantity);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleCustomizationChange = (groupId: string, optionId: string) => {
    setCustomizations(prev => {
      return prev.map(group => {
        if (group.id === groupId) {
          if (group.type === 'single') {
            // For single choice, deselect all other options in this group
            return {
              ...group,
              options: group.options.map(option => ({
                ...option,
                selected: option.id === optionId
              }))
            };
          } else {
            // For multiple choice, toggle the selected option
            return {
              ...group,
              options: group.options.map(option => ({
                ...option,
                selected: option.id === optionId ? !option.selected : option.selected
              }))
            };
          }
        }
        return group;
      });
    });
  };

  const validateCustomizations = () => {
    for (const group of customizations) {
      if (group.required && !group.options.some(option => option.selected)) {
        Alert.alert('Missing Selection', `Please select an option for ${group.name}`);
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateCustomizations()) {
      return;
    }

    const selectedCustomizations = customizations
      .filter(group => group.options.some(option => option.selected))
      .map(group => ({
        groupId: group.id,
        groupName: group.name,
        selections: group.options
          .filter(option => option.selected)
          .map(option => ({
            id: option.id,
            name: option.name,
            price: option.price,
          }))
      }));

    dispatch(addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity,
      customizations: selectedCustomizations,
      specialInstructions,
      restaurantId: '1', // This would come from the restaurant context
      restaurantName: 'Bella Italia Ristorante', // This would come from the restaurant context
    }));

    Alert.alert(
      'Added to Cart',
      `${menuItem.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart' as never) },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.favoriteButton}>
        <Icon name="heart-outline" size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderItemImage = () => (
    <View style={styles.imageContainer}>
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
        style={styles.imageOverlay}
      />
      <View style={styles.imagePlaceholder}>
        <Icon name="restaurant" size={80} color={colors.textTertiary} />
      </View>
      {menuItem.isPopular && (
        <View style={styles.popularBadge}>
          <Icon name="flame" size={14} color={colors.warning} />
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
      {menuItem.isVegetarian && (
        <View style={styles.vegetarianBadge}>
          <Icon name="leaf" size={14} color="#22C55E" />
          <Text style={styles.vegetarianText}>Vegetarian</Text>
        </View>
      )}
    </View>
  );

  const renderItemInfo = () => (
    <View style={[styles.itemInfo, { backgroundColor: colors.surface }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {menuItem.name}
        </Text>
        <View style={styles.itemMeta}>
          <Text style={[styles.itemPrice, { color: colors.septenary }]}>
            {formatCurrency(totalPrice)}
          </Text>
          <Text style={[styles.basePrice, { color: colors.textSecondary }]}>
            ({formatCurrency(menuItem.price)} each)
          </Text>
        </View>
      </View>

      <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
        {menuItem.description}
      </Text>

      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {menuItem.preparationTime} min
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="local-fire-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {menuItem.nutritionInfo.calories} cal
            </Text>
          </View>
        </View>

        {menuItem.spicyLevel > 0 && (
          <View style={styles.spicyLevel}>
            <Text style={[styles.spicyLabel, { color: colors.textSecondary }]}>
              Spice Level:
            </Text>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="flame-outline"
                size={16}
                color={index < menuItem.spicyLevel ? '#EF4444' : colors.textSecondary}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={[styles.quantitySection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Quantity
      </Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, { borderColor: colors.border }]}
          onPress={() => handleQuantityChange(quantity - 1)}
        >
          <Icon name="remove" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.quantityDisplay, { backgroundColor: colors.background }]}>
          <Text style={[styles.quantityText, { color: colors.text }]}>
            {quantity}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.quantityButton, { borderColor: colors.border }]}
          onPress={() => handleQuantityChange(quantity + 1)}
        >
          <Icon name="add" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCustomizationGroup = (group: CustomizationGroup) => (
    <View key={group.id} style={[styles.customizationGroup, { backgroundColor: colors.surface }]}>
      <View style={styles.customizationHeader}>
        <Text style={[styles.customizationTitle, { color: colors.text }]}>
          {group.name}
        </Text>
        {group.required && (
          <Text style={[styles.requiredText, { color: '#EF4444' }]}>Required</Text>
        )}
      </View>

      <Text style={[styles.customizationSubtitle, { color: colors.textSecondary }]}>
        {group.type === 'single' ? 'Select one' : 'Select multiple'}
      </Text>

      {group.options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.customizationOption,
            {
              borderColor: option.selected ? colors.septenary : colors.border,
              backgroundColor: option.selected ? `${colors.septenary}20` : 'transparent',
            },
          ]}
          onPress={() => handleCustomizationChange(group.id, option.id)}
        >
          <View style={styles.optionLeft}>
            <View
              style={[
                styles.radioButton,
                {
                  borderColor: option.selected ? colors.septenary : colors.border,
                  backgroundColor: option.selected ? colors.septenary : 'transparent',
                },
              ]}
            >
              {option.selected && (
                <Icon name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            <Text style={[styles.optionName, { color: colors.text }]}>
              {option.name}
            </Text>
          </View>

          {option.price > 0 && (
            <Text style={[styles.optionPrice, { color: colors.septenary }]}>
              +{formatCurrency(option.price)}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSpecialInstructions = () => (
    <View style={[styles.instructionsSection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Special Instructions
      </Text>
      <Input
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
        placeholder="Any special requests or dietary restrictions?"
        multiline
        numberOfLines={3}
        style={styles.instructionsInput}
      />
    </View>
  );

  const renderNutritionInfo = () => (
    <View style={[styles.nutritionSection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Nutrition Information
      </Text>

      <View style={styles.nutritionGrid}>
        <View style={styles.nutritionItem}>
          <Text style={[styles.nutritionValue, { color: colors.text }]}>
            {menuItem.nutritionInfo.calories}
          </Text>
          <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
            Calories
          </Text>
        </View>

        <View style={styles.nutritionItem}>
          <Text style={[styles.nutritionValue, { color: colors.text }]}>
            {menuItem.nutritionInfo.protein}g
          </Text>
          <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
            Protein
          </Text>
        </View>

        <View style={styles.nutritionItem}>
          <Text style={[styles.nutritionValue, { color: colors.text }]}>
            {menuItem.nutritionInfo.carbs}g
          </Text>
          <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
            Carbs
          </Text>
        </View>

        <View style={styles.nutritionItem}>
          <Text style={[styles.nutritionValue, { color: colors.text }]}>
            {menuItem.nutritionInfo.fat}g
          </Text>
          <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
            Fat
          </Text>
        </View>
      </View>

      {menuItem.allergens.length > 0 && (
        <View style={styles.allergenSection}>
          <Text style={[styles.allergenTitle, { color: colors.text }]}>
            Allergens:
          </Text>
          <View style={styles.allergenTags}>
            {menuItem.allergens.map((allergen, index) => (
              <View key={index} style={styles.allergenTag}>
                <Text style={[styles.allergenText, { color: '#EF4444' }]}>
                  {allergen}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {renderItemImage()}
        {renderItemInfo()}
        {renderQuantitySelector()}

        {customizations.map(renderCustomizationGroup)}

        {renderSpecialInstructions()}
        {renderNutritionInfo()}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <View style={styles.bottomBarLeft}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
            Total
          </Text>
          <Text style={[styles.totalPrice, { color: colors.septenary }]}>
            {formatCurrency(totalPrice)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.septenary }]}
          onPress={handleAddToCart}
        >
          <Text style={[styles.addButtonText, { color: colors.text }]}>
            Add to Cart ({quantity})
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginTop: 100,
  },
  imageContainer: {
    height: 250,
    position: 'relative',
    overflow: 'hidden',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 146, 60, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Medium',
    color: '#FB923C',
  },
  vegetarianBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  vegetarianText: {
    fontSize: 10,
    fontFamily: 'SFProDisplay-Medium',
    color: '#22C55E',
  },
  itemInfo: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 24,
    fontFamily: 'SFProDisplay-Bold',
    flex: 1,
    marginRight: 12,
  },
  itemMeta: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Bold',
  },
  basePrice: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginTop: 2,
  },
  itemDescription: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  itemDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
  },
  spicyLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spicyLabel: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
  },
  quantitySection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    minWidth: 60,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  customizationGroup: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  customizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customizationTitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
  requiredText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
  },
  customizationSubtitle: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: 12,
  },
  customizationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionName: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    flex: 1,
  },
  optionPrice: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
  },
  instructionsSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  instructionsInput: {
    marginTop: 8,
  },
  nutritionSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Bold',
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  allergenSection: {
    marginTop: 16,
  },
  allergenTitle: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    marginBottom: 8,
  },
  allergenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  allergenText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Medium',
  },
  bottomPadding: {
    height: 120,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bottomBarLeft: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
  },
  totalPrice: {
    fontSize: 20,
    fontFamily: 'SFProDisplay-Bold',
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
});

export default MealDetailScreen;