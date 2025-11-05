import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Input } from '@components/common';
import { theme } from '@theme/index';
import { loginUser } from '@store/slices/authSlice';
import { RootState } from '@store/index';
import { isValidEmail } from '@utils/index';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(loginUser(formData));
      if (loginUser.rejected.match(result)) {
        Alert.alert('Login Failed', result.payload as string);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    // Social login implementation
    console.log(`Social login with ${provider}`);
  };

  const { colors, spacing, typography } = theme;

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with close button */}
          <View style={styles.header}>
            <Button
              icon="close"
              onPress={() => navigation.goBack()}
              variant="ghost"
              size="small"
              style={styles.closeButton}
            />
          </View>

          {/* Login form container */}
          <View style={styles.formContainer}>
            <LinearGradient
              colors={colors.gradients.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.formCard}
            >
              {/* Logo and title */}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Icon
                    name="restaurant"
                    size={40}
                    color={colors.text}
                  />
                </View>
              </View>

              <View style={styles.titleContainer}>
                <View>
                  <Text style={[styles.welcomeText, { color: colors.text }]}>
                    Welcome Back
                  </Text>
                  <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
                    Sign in to continue your culinary journey
                  </Text>
                </View>
              </View>

              {/* Form fields */}
              <View style={styles.formFields}>
                <Input
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => {
                    setFormData({ ...formData, email: value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  error={errors.email}
                  leftIcon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Enter your email"
                />

                <Input
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => {
                    setFormData({ ...formData, password: value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  error={errors.password}
                  leftIcon="lock-closed-outline"
                  rightIcon={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  showPasswordToggle={true}
                  placeholder="Enter your password"
                />

                {/* Remember me and forgot password */}
                <View style={styles.formActions}>
                  <View style={styles.rememberMeContainer}>
                    <Button
                      title="Remember me"
                      onPress={() => setRememberMe(!rememberMe)}
                      variant="ghost"
                      size="small"
                      style={[
                        styles.rememberMeButton,
                        {
                          backgroundColor: rememberMe
                            ? colors.septenary
                            : 'rgba(255, 255, 255, 0.1)',
                        },
                      ]}
                    />
                  </View>

                  <Button
                    title="Forgot Password?"
                    onPress={() => navigation.navigate('ForgotPassword' as never)}
                    variant="ghost"
                    size="small"
                    textStyle={{ color: colors.septenary }}
                  />
                </View>
              </View>

              {/* Login button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={isLoading}
                  icon="log-in-outline"
                />
              </View>
            </LinearGradient>

            {/* Social login section */}
            <View style={styles.socialSection}>
              <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: colors.surfaceDark }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                  OR
                </Text>
                <View style={[styles.divider, { backgroundColor: colors.surfaceDark }]} />
              </View>

              <View style={styles.socialButtons}>
                <Button
                  icon="logo-google"
                  onPress={() => handleSocialLogin('google')}
                  variant="secondary"
                  style={styles.socialButton}
                />
                <Button
                  icon="logo-apple"
                  onPress={() => handleSocialLogin('apple')}
                  variant="secondary"
                  style={styles.socialButton}
                />
                <Button
                  icon="logo-facebook"
                  onPress={() => handleSocialLogin('facebook')}
                  variant="secondary"
                  style={styles.socialButton}
                />
              </View>
            </View>

            {/* Sign up link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
                <Text
                  style={[styles.signupLink, { color: colors.septenary }]}
                  onPress={() => navigation.navigate('Register' as never)}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  formCard: {
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'SFProDisplay-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
  },
  formFields: {
    marginBottom: 30,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  rememberMeContainer: {
    flex: 1,
  },
  rememberMeButton: {
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    marginTop: 20,
  },
  socialSection: {
    marginTop: 40,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  signupText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  signupLink: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
});

export default LoginScreen;