import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Input } from '@components/common';
import { theme } from '@theme/index';
import { forgotPassword, resetPassword } from '@store/slices/authSlice';
import { RootState } from '@store/index';
import { isValidEmail } from '@utils/index';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Check if we have a token from route params (for OTP flow)
  useEffect(() => {
    if (route.params?.token) {
      // This is coming from email link, skip OTP and go to reset
      setCurrentStep('reset');
    }
  }, [route.params]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateEmail = (): boolean => {
    if (!email) {
      setErrors({ ...errors, email: 'Email is required' });
      return false;
    }
    if (!isValidEmail(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email' });
      return false;
    }
    setErrors({ ...errors, email: '' });
    return true;
  };

  const validateOTP = (): boolean => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrors({ ...errors, otp: 'Please enter the 6-digit code' });
      return false;
    }
    if (!/^\d{6}$/.test(otpString)) {
      setErrors({ ...errors, otp: 'Please enter a valid 6-digit code' });
      return false;
    }
    setErrors({ ...errors, otp: '' });
    return true;
  };

  const validateResetForm = (): boolean => {
    const newErrors = {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    };

    if (!newPassword) {
      newErrors.password = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSendOTP = async () => {
    if (!validateEmail()) return;

    try {
      const result = await dispatch(forgotPassword(email));
      if (forgotPassword.rejected.match(result)) {
        Alert.alert('Error', result.payload as string);
      } else {
        setCurrentStep('otp');
        setResendTimer(60); // 60 seconds timer
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP()) return;

    try {
      // For demo, we'll just move to reset step
      setCurrentStep('reset');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP code');
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    try {
      const result = await dispatch(forgotPassword(email));
      if (forgotPassword.rejected.match(result)) {
        Alert.alert('Error', result.payload as string);
      } else {
        setResendTimer(60);
        Alert.alert('Success', 'OTP sent to your email');
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  const handleResetPassword = async () => {
    if (!validateResetForm()) return;

    try {
      const result = await dispatch(resetPassword({
        token: route.params?.token || 'mock-token',
        password: newPassword,
      }));

      if (resetPassword.rejected.match(result)) {
        Alert.alert('Error', result.payload as string);
      } else {
        Alert.alert(
          'Success',
          'Password has been reset successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login' as never),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      // Focus next input (implementation depends on your OTP input component)
    }
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const { colors } = theme;

  // Email Step
  if (currentStep === 'email') {
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
                icon="arrow-back"
                onPress={() => navigation.goBack()}
                variant="ghost"
                size="small"
                style={styles.backButton}
              />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <LinearGradient
                colors={colors.gradients.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.formCard}
              >
                {/* Icon and title */}
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Icon
                      name="lock-closed-outline"
                      size={50}
                      color={colors.text}
                    />
                  </View>
                </View>

                <View style={styles.titleContainer}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    Forgot Password
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Enter your email address and we'll send you a code to reset your password
                  </Text>
                </View>

                {/* Email input */}
                <View style={styles.formFields}>
                  <Input
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    error={errors.email}
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Enter your email address"
                  />
                </View>

                {/* Send OTP button */}
                <View style={styles.buttonContainer}>
                  <Button
                    title="Send Code"
                    onPress={handleSendOTP}
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={isLoading}
                    icon="mail-outline"
                  />
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  // OTP Step
  if (currentStep === 'otp') {
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
                icon="arrow-back"
                onPress={() => setCurrentStep('email')}
                variant="ghost"
                size="small"
                style={styles.backButton}
              />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <LinearGradient
                colors={colors.gradients.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.formCard}
              >
                {/* Icon and title */}
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Icon
                      name="mail-outline"
                      size={50}
                      color={colors.text}
                    />
                  </View>
                </View>

                <View style={styles.titleContainer}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    Verify Your Email
                  </Text>
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    We've sent a 6-digit code to {email}
                  </Text>
                </View>

                {/* OTP Input */}
                <View style={styles.formFields}>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        value={digit}
                        onChangeText={(value) => handleOTPChange(value, index)}
                        onKeyPress={({ nativeEvent }) => handleOTPKeyPress(nativeEvent.key, index)}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        textAlign="center"
                        placeholder="-"
                      />
                    ))}
                  </View>

                  {errors.otp && (
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {errors.otp}
                    </Text>
                  )}

                  {/* Resend Code */}
                  <View style={styles.resendContainer}>
                    <Text style={[styles.resendText, { color: colors.textSecondary }]}>
                      Didn't receive the code?{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={handleResendOTP}
                      disabled={resendTimer > 0}
                      style={styles.resendButton}
                    >
                      <Text style={[
                        styles.resendButtonText,
                        {
                          color: resendTimer > 0 ? colors.textTertiary : colors.septenary,
                        }
                      ]}>
                        {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend Code'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Verify button */}
                <View style={styles.buttonContainer}>
                  <Button
                    title="Verify Code"
                    onPress={handleVerifyOTP}
                    variant="primary"
                    size="large"
                    fullWidth
                    icon="checkmark-outline"
                  />
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  // Reset Password Step
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
              icon="arrow-back"
              onPress={() => setCurrentStep('otp')}
              variant="ghost"
              size="small"
              style={styles.backButton}
            />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <LinearGradient
              colors={colors.gradients.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.formCard}
            >
              {/* Icon and title */}
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <Icon
                    name="key-outline"
                    size={50}
                    color={colors.text}
                  />
                </View>
              </View>

              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Reset Password
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Enter your new password
                </Text>
              </View>

              {/* Password fields */}
              <View style={styles.formFields}>
                <Input
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  error={errors.password}
                  leftIcon="lock-closed-outline"
                  rightIcon={showPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  showPasswordToggle={true}
                  placeholder="Enter new password"
                />

                <Input
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={errors.confirmPassword}
                  leftIcon="lock-closed-outline"
                  rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  secureTextEntry={!showConfirmPassword}
                  showPasswordToggle={true}
                  placeholder="Confirm new password"
                />
              </View>

              {/* Reset button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Reset Password"
                  onPress={handleResetPassword}
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={isLoading}
                  icon="checkmark-circle-outline"
                />
              </View>
            </LinearGradient>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'SFProDisplay-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  formFields: {
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    flex: 1,
    marginHorizontal: 4,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    marginTop: -12,
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  resendButton: {
    marginLeft: 4,
  },
  resendButtonText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;