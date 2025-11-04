import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from '@components/common';
import { theme } from '@theme/index';
import { RootState } from '@store/index';
import { updateUser } from '@store/slices/userSlice';
import { logout } from '@store/slices/authSlice';
import { formatCurrency, formatDate } from '@utils/index';
import { User } from '@types/index';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = theme;

  // Get current user from Redux state
  const { user } = useSelector((state: RootState) => state.user);

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>(user?.gender || '');

  // Preferences
  const [notifications, setNotifications] = useState(user?.preferences?.notifications || true);
  const [marketingEmails, setMarketingEmails] = useState(user?.preferences?.marketingEmails || false);
  const locationSharing, setLocationSharing] = useState(user?.preferences?.locationSharing || false);
  const biometricAuth, setBiometricAuth] = useState(user?.preferences?.biometricAuth || false);
  const faceID, setFaceID] = useState(user?.faceID || '');

  // Address information
  const [addresses, setAddresses] = useState(user?.addresses || []);

  // App settings
  const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode || false);
  const [autoPlay, setAutoPlay] = useState(user?.preferences?.autoPlay || false);
  const hapticFeedback, setHapticFeedback] = useState(user?.preferences?.hapticFeedback || true);
  const saveOrders, setSaveOrders] = useState(user?.preferences?.saveOrders || true);

  // State for loading states
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Update form state when user data changes
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '');
      setGender(user.gender || '');
      setAddresses(user.addresses || []);
      setNotifications(user.preferences?.notifications || true);
      setMarketingEmails(user.preferences?.marketingEmails || false);
      setLocationSharing(user.preferences?.locationSharing || false);
      setBiometricAuth(user.preferences?.biometricAuth || false);
      setFaceID(user.faceID || '');

      // App preferences
      setDarkMode(user.preferences?.darkMode || false);
      setAutoPlay(user.preferences?.autoPlay || false);
      setHapticFeedback(user.preferences?.hapticFeedback || true);
      setSaveOrders(user.preferences?.saveOrders || true);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Missing Information', 'Please fill in your first name, last name, and email to continue.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number with at least 10 digits.');
      return;
    }

    setSaving(true);

    try {
      const updatedUser: User = {
        ...user,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        gender,
        updatedAt: new Date().toISOString(),
      };

      await dispatch(updateUser(updatedUser));

      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      setSaving(false);
    } catch (error) {
      Alert.alert('Update Failed', 'There was an error updating your profile. Please try again.');
      setSaving(false);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      const updatedPreferences = {
        notifications,
        marketingEmails,
        locationSharing,
        biometricAuth,
        faceID,
        darkMode,
        autoPlay,
        hapticFeedback,
        saveOrders,
      };

      await dispatch(updateUser({
        ...user,
        preferences: updatedPreferences,
      }));

      Alert.alert('Preferences Updated', 'Your preferences have been saved successfully.');
    } catch (error) {
      Alert.alert('Update Failed', 'There was an error updating your preferences. Please try again.');
    }
  };

  const handleUpdateAddress = () => {
    // In a real app, this would open a screen to manage addresses
    Alert.alert('Coming Soon', 'Address management will be available in the next update.');
  };

  const handleUpdatePaymentMethods = () => {
    // In a real app, this would open a screen to manage payment methods
    Alert.alert('Coming Soon', 'Payment method management will be available in the next update.');
  };

  const handleUpdateSecurity = () => {
    Alert.alert('Coming Soon', 'Security settings will be available in the next update.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            setLoggingOut(true);
            // In a real app, this would call API to delete account
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            // Navigate to onboarding
            navigation.navigate('Onboarding' as never);
          },
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: () => {
            dispatch(logout());
            navigation.navigate('Onboarding' as never);
          },
          onPress: () => {
            navigation.navigate('Onboarding' as never);
          },
        },
      ]
    );
  };

  const handleViewTerms = () => {
    Linking.openURL('https://vibes-fooddelivery.com/terms').catch(err =>
      Alert.alert('Error', 'Could not open terms page.')
    );
  };

  const handleViewPrivacy = () => {
    Linking.openURL('https://vibes-fooddelivery.com/privacy').catch(err =>
      Alert.alert('Error', 'Could not open privacy page.')
    );
  };

  const handleViewHelp = () => {
    navigation.navigate('Help' as never);
  };

  const renderProfileHeader = () => (
    <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
      <Text style={[styles.profileTitle, { color: colors.text }]}>
        Profile
      </Text>

      <TouchableOpacity
        style={[styles.settingsButton, { borderColor: colors.border }]}
        onPress={() => navigation.navigate('Settings' as never)}
      >
        <Icon name="settings-outline" size={20} color={colors.textSecondary} />
        <Text style={[styles.settingsButtonText, { color: colors.textSecondary }]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPersonalInfo = () => (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Personal Information
      </Text>

      <View style={styles.formGroup}>
        <Input
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
        />

        <Input
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
        />

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Input
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 (555) 123-4567"
          keyboardType="phone-pad"
        />

        <View style={styles.dateRow}>
          <Input
            label="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
          />
          <TouchableOpacity
            style={styles.dateIcon}
            onPress={() => {
              const today = new Date();
              const formattedDate = today.toISOString().slice(0, 10);
              setDateOfBirth(formattedDate);
            }}
          >
            <Icon name="calendar-outline" size={20} color={colors.septenary} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.septenary }]}
        onPress={handleSaveProfile}
        disabled={saving}
      >
        <Icon name="save-outline" size={16} color={colors.text} />
        <Text style={[styles.saveButtonText, { color: colors.text }]}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPreferences = () => (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Preferences
      </Text>

      <View style={styles.formGroup}>
        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Push Notifications
          </Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={colors.septenary}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#FFFFFF"
          onTintColor={colors.septenary}
          style={styles.switch}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Marketing Emails
          </Text>
          <Switch
            value={marketingEmails}
            onValueChange={setMarketingEmails}
            trackColor={colors.septenary}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#FFFFFF"
            onTintColor={colors.septenary}
            style={styles.switch}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Location Sharing
          </Text>
          <Switch
            value={locationSharing}
            onValueChange={setLocationSharing}
            trackColor={colors.septenary}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#FFFFFF"
            onTintColor={colors.septenary}
            style={styles.switch}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Biometric Authentication
          </Text>
          <Switch
            value={biometricAuth}
            onValueChange={setBiometricAuth}
            trackColor={colors.septenary}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#FFFFFF"
            onTintColor={colors.septenary}
            style={styles.switch}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Face ID
          </Text>
          <Switch
            value={faceID !== ''}
            onValueChange={(value) => setFaceID(value ? Math.random().toString(36).substring(2, 11) : '')}
            trackColor={colors.septenary}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#FFFFFF"
            onTintColor={colors.septenary}
            style={styles.switch}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.septenary }]}
        onPress={handleUpdatePreferences}
        disabled={saving}
      >
        <Icon name="save-outline" size={16} color={colors.text} />
        <Text style={[styles.saveButtonText, { color: colors.text }]}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAppSettings = () => (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        App Settings
      </Text>

      <View style={styles.formGroup}>
        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={colors.septenary}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#FFFFFF"
            onTintColor={colors.septenary}
            style={styles.switch}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Auto-play Videos
          </Text>
          <Switch
            value={autoPlay}
            onValueChange={setAutoPlay}
            trackColor={colors.septenary}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#FFFFFF"
            onTintColor={colors.septenary}
            style={styles.switch}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Haptic Feedback
          </Text>
          <Switch
            value={hapticFeedback}
            onValueChange={setHapticFeedback}
            trackColor={colors.septenary}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#FFFFFF"
            onTintColor={colors.septenary}
            style={styles.switch}
          />
        </View>

        <View style={styles.preferenceRow}>
          <Text style={[styles.preferenceLabel, { color: colors.text }]}>
            Save Order History
          </Text>
          <Switch
            value={saveOrders}
            onValueChange={setSaveOrders}
            trackColor={colors.septenary}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#FFFFFF"
            onTintColor={colors.septenary}
            style={styles.switch}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.septenary }]}
        onPress={handleUpdateSecurity}
      >
        <Icon name="shield-outline" size={16} color={colors.text} />
        <Text style={[styles.saveButtonText, { color: colors.text }]}>
          Update Security Settings
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.legalLinks}>
        <TouchableOpacity
          style={styles.legalLink}
          onPress={handleViewTerms}
        >
          <Text style={[styles.legalLinkText, { color: colors.septenary }]}>
            Terms of Service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.legalLink}
          onPress={handleViewPrivacy}
        >
          <Text style={[styles.legalLinkText, { color: colors.septenary }]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSupport = () => (
    <View style={[styles.supportContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Support
      </Text>

      <View style={styles.supportRow}>
        <TouchableOpacity style={[styles.supportItem, { borderStyle: { borderRightWidth: 1, borderColor: colors.border } ]}>
          <Icon name="help-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.supportText, { color: colors.text }]}>
            Help Center
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.supportItem, borderStyle: { borderRightWidth: 1, borderColor: colors.border } ]}>
          <Icon name="call-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.supportText, { color: colors.text }]}>
            Call Us
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.supportItem, borderStyle: { borderRightWidth: 1, borderColor: colors.border } ]}>
          <Icon name="chatbubbles-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.supportText, { color: colors.text }]}>
            Live Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.supportItem, borderStyle: { borderRightWidth: 1, borderColor: colors.border } ]}>
          <Icon name="mail-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.supportText, { color: colors.text }]}>
            Contact Support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.supportItem, borderStyle: { borderRightWidth: 1, borderColor: colors.border } ]}>
          <Icon name="information-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.supportText, { color: colors.text }]}>
            FAQ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDangerZone = () => (
    <View style={[styles.dangerZone, { backgroundColor: colors.surface }]}>
      <Text style={[styles.dangerZoneTitle, { color: colors.text }]}>
        Account Actions
      </Text>

      <View style={styles.dangerCard}>
        <Icon name="warning" size={60} color="#EF4444" />
        <Text style={[styles.dangerZoneText, { color: colors.text }]}>
          Delete Account
        </Text>
        <Text style={[styles.dangerZoneDescription, { color: colors.textSecondary }]}>
          This will permanently delete your account and all associated data. This action cannot be undone.
        </Text>
      </View>

      <View style={styles.dangerActions}>
        <TouchableOpacity
          style={[styles.dangerAction, { backgroundColor: '#10B981' }]}
          onPress={() => {
            navigation.navigate('Settings' as never);
          }}
        >
          <Icon name="business-outline" size={20} color="#FFFFFF" />
          <Text style={[styles.dangerActionText, { color: '#FFFFFF' }]}>
            Keep Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerAction, { backgroundColor: '#EF4444' }]}
          onPress={handleDeleteAccount}
        >
          <Icon name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={[styles.dangerActionText, { color: '#FFFFFF' }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.dangerNote, { color: colors.textTertiary }]}>
        Note: Deleting your account will remove all order history, preferences, and personal data.
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {renderProfileHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {renderPersonalInfo()}
        {renderPreferences()}
        {renderAppSettings()}

        {renderSupport()}
        {renderDangerZone()}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderSupport()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 24,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 4,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  settingsButtonText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Semibold',
    marginBottom: 16,
  },
  formGroup: {
    gap: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  preferenceLabel: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    flex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Semibold',
  },
  // Personal Info Section
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dateIcon: {
    position: 'absolute',
    right: 0,
  },
  // Preferences
  switch: {
    height: 24,
    width: 48,
    borderWidth: 1,
    borderRadius: 12,
  },
  // App Settings Section
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  legalLinkText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    color: colors.septenary,
    textDecorationLine: 'underline',
  },
  // Support Section
  supportContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minHeight: 44,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  supportText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
  },
  // Danger Zone
  dangerZone: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  dangerCard: {
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Semibold',
    textAlign: 'center',
    marginBottom: 8,
  },
  dangerZoneDescription: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  dangerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  dangerActionText: {
    fontSize: 14,
    fontFamily: 'SFProDisplay-Medium',
    color: '#FFFFFF',
  },
  dangerNote: {
    fontSize: 12,
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomPadding: {
    height: 100,
  },
});

export default ProfileScreen;