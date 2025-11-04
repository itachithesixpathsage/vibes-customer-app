import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@components/common';
import { theme } from '@theme/index';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values for page indicators
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const onboardingData = [
    {
      id: 1,
      icon: 'rocket-outline',
      title: 'Discover Culinary Universe',
      subtitle: 'Explore thousands of restaurants and cuisines from around the world',
      gradient: ['#680E4B', '#7C238C', '#854798'],
    },
    {
      id: 2,
      icon: 'flash-outline',
      title: 'Lightning Delivery',
      subtitle: 'Real-time tracking with ETA updates and live driver location',
      gradient: ['#550944', '#815D9C', '#7C72A0'],
    },
    {
      id: 3,
      icon: 'star-outline',
      title: 'Your Flavor Profile',
      subtitle: 'Personalized recommendations based on your tastes and preferences',
      gradient: ['#42033D', '#854798', '#815D9C'],
    },
  ];

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    setCurrentIndex(index);

    // Animate indicators
    Animated.timing(indicatorAnim, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      // Navigate to auth screen
      navigation.navigate('Auth' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Auth' as never);
  };

  const { colors, spacing } = theme;

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Skip button */}
      <View style={styles.header}>
        <Button
          title="Skip"
          onPress={handleSkip}
          variant="ghost"
          size="small"
          style={styles.skipButton}
        />
      </View>

      {/* Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={[styles.page, { width }]}>
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <View style={styles.iconCircle}>
                <Icon
                  name={item.icon}
                  size={80}
                  color={colors.text}
                />
              </View>
            </LinearGradient>

            <View style={styles.textContainer}>
              <Animated.Text style={[styles.title, { color: colors.text }]}>
                {item.title}
              </Animated.Text>
              <Animated.Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {item.subtitle}
              </Animated.Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Page indicators */}
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => {
          const scale = indicatorAnim.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          const opacity = indicatorAnim.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  transform: [{ scale }],
                  opacity,
                  backgroundColor: currentIndex === index ? colors.text : colors.surface,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Action buttons */}
      <View style={styles.actionContainer}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          variant="primary"
          size="large"
          fullWidth
          icon="arrow-forward"
          iconPosition="right"
        />
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
    justifyContent: 'flex-end',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'SFProDisplay-Bold',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  actionContainer: {
    paddingHorizontal: 30,
    paddingBottom: 60,
    marginTop: 20,
  },
});

export default OnboardingScreen;