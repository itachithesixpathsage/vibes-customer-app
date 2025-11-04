import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { registerUser } from '@store/slices/authSlice';
import { RootState } from '@store/index';
import { isValidEmail, isValidPhone } from '@utils/index';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    marketingConsent: false,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: '',
    };

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      // Calculate password strength
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (formData.password.length >= 12) strength += 1;
      if (/[A-Z]/.test(formData.password)) strength += 1;
      if (/[a-z]/.test(formData.password)) strength += 1;
      if (/[0-9]/.test(formData.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
      setPasswordStrength(strength);
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error.length > 0);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        marketingConsent: formData.marketingConsent,
        termsAccepted: formData.termsAccepted,
      }));

      if (registerUser.rejected.match(result)) {
        Alert.alert('Registration Failed', result.payload as string);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return theme.colors.error;
    if (passwordStrength <= 4) return theme.colors.warning;
    return theme.colors.success;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  const { colors, spacing } = theme;

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
          {/* Header */}
          <View style={styles.header}>
            <Button
              icon="close"
              onPress={() => navigation.goBack()}
              variant="ghost"
              size="small"
              style={styles.closeButton}
            />
          </View>

          {/* Register form */}
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
                    name="person-add-outline"
                    size={40}
                    color={colors.text}
                  />
                </View>
              </View>

              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Create Account
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Join our culinary community
                </Text>
              </View>

              {/* Form fields */}
              <View style={styles.formFields}>
                {/* Name fields */}
                <View style={styles.nameRow}>
                  <View style={styles.nameField}>
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChangeText={(value) => {
                        setFormData({ ...formData, firstName: value });
                        if (errors.firstName) setErrors({ ...errors, firstName: '' });
                      }}
                      error={errors.firstName}
                      placeholder="John"
                      style={styles.nameInput}
                    />
                  </View>

                  <View style={styles.nameField}>
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChangeText={(value) => {
                        setFormData({ ...formData, lastName: value });
                        if (errors.lastName) setErrors({ ...errors, lastName: '' });
                      }}
                      error={errors.lastName}
                      placeholder="Doe"
                      style={styles.nameInput}
                    />
                  </View>
                </View>

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
                  placeholder="john.doe@example.com"
                />

                <Input
                  label="Phone (Optional)"
                  value={formData.phone}
                  onChangeText={(value) => {
                    setFormData({ ...formData, phone: value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  error={errors.phone}
                  leftIcon="call-outline"
                  keyboardType="phone-pad"
                  placeholder="+1 (555) 123-4567"
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
                  placeholder="Create a strong password"
                />

                {/* Password strength indicator */}
                {formData.password && (
                  <View style={styles.passwordStrengthContainer}>
                    <Text style={[styles.passwordStrengthLabel, { color: colors.textSecondary }]}>
                      Password Strength:
                    </Text>
                    <View style={styles.passwordStrengthBar}>
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <View
                          key={level}
                          style={[
                            styles.passwordStrengthSegment,
                            {
                              backgroundColor: level <= passwordStrength
                                ? getPasswordStrengthColor()
                                : colors.surface,
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={[
                      styles.passwordStrengthText,
                      { color: getPasswordStrengthColor() }
                    ]}>
                      {getPasswordStrengthText()}
                    </Text>
                  </View>
                )}

                <Input
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => {
                    setFormData({ ...formData, confirmPassword: value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  error={errors.confirmPassword}
                  leftIcon="lock-closed-outline"
                  rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  secureTextEntry={!showConfirmPassword}
                  showPasswordToggle={true}
                  placeholder="Confirm your password"
                />

                {/* Marketing consent */}
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setFormData({ ...formData, marketingConsent: !formData.marketingConsent })}
                >
                  <View style={[
                    styles.checkbox,
                    {
                      backgroundColor: formData.marketingConsent ? colors.septenary : 'transparent',
                      borderColor: colors.surface,
                    }
                  ]}>
                    {formData.marketingConsent && (
                      <Icon name="checkmark" size={16} color={colors.text} />
                    )}
                  </View>
                  <Text style={[styles.checkboxText, { color: colors.textSecondary }]}>
                    Send me promotions and updates via email
                  </Text>
                </TouchableOpacity>

                {/* Terms and conditions */}
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
                >
                  <View style={[
                    styles.checkbox,
                    {
                      backgroundColor: formData.termsAccepted ? colors.septenary : 'transparent',
                      borderColor: colors.surface,
                    }
                  ]}>
                    {formData.termsAccepted && (
                      <Icon name="checkmark" size={16} color={colors.text} />
                    )}
                  </View>
                  <View style={styles.termsContainer}>
                    <Text style={[styles.checkboxText, { color: colors.textSecondary }]}>
                      I agree to the{' '}
                    </Text>
                    <TouchableOpacity>
                      <Text style={[styles.linkText, { color: colors.septenary }]}>
                        Terms of Service
                      </Text>
                    </TouchableOpacity>
                    <Text style={[styles.checkboxText, { color: colors.textSecondary }]}>
                      {' '}and{' '}
                    </Text>
                    <TouchableOpacity>
                      <Text style={[styles.linkText, { color: colors.septenary }]}>
                        Privacy Policy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {errors.terms && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.terms}
                  </Text>
                )}
              </View>

              {/* Register button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Create Account"
                  onPress={handleRegister}
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={isLoading}
                  icon="person-add-outline"
                />
              </View>
            </LinearGradient>

            {/* Sign in link */}
            <View style={styles.signinContainer}>
              <Text style={[styles.signinText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
                <Text
                  style={[styles.signinLink, { color: colors.septenary }]}
                  onPress={() => navigation.navigate('Login' as never)}
                >
                  Sign In
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
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'SFProDisplay-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
  },
  formFields: {
    marginBottom: 30,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 16,
  },
  nameField: {
    flex: 1,
  },
  nameInput: {
    marginBottom: 16,
  },
  passwordStrengthContainer: {
    marginTop: -8,
    marginBottom: 16,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginBottom: 8,
  },
  passwordStrengthBar: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  passwordStrengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Semibold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    marginTop: -12,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  signinContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  signinText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  signinLink: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Semibold',
  },
});

export default RegisterScreen;