import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { Feather, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

import { API_ENDPOINTS, getAuthHeaders } from '../../constants/api';

export default function FarmerProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFarmerProfile = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.FARMERS.PROFILE, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerProfile();
  }, []);

  // Map backend profile to UI fields or use defaults
  const displayData = {
    fullName: profile?.name || 'Farmer',
    mobile: profile?.contact?.phone || '--',
    email: profile?.contact?.email || '--',
    address: profile?.location?.address || 'Address not set',
    state: profile?.location?.region || '--',
    district: profile?.location?.district || '--',
    pincode: profile?.location?.pincode || '--',
    pmfbyId: profile?.pmfbyId || 'Not Assigned',
    fatherName: profile?.fatherName || '--',
    age: profile?.age || '--',
    gender: profile?.gender || '--',
    farmerType: profile?.farmerType || '--',
    farmerCategory: profile?.farmerCategory || '--',
    uidNumber: profile?.uidNumber || '--',
    bankName: profile?.bank?.bankName || '--',
    accountNumber: profile?.bank?.accountNumber || '--',
    ifscCode: profile?.bank?.ifscCode || '--',
    insuranceCoverage: profile?.insurance?.coverageAmount ? `₹ ${profile?.insurance.coverageAmount.toLocaleString()}` : '₹ 0',
    premiumPaid: profile?.insurance?.premiumPaid ? `₹ ${profile?.insurance.premiumPaid.toLocaleString()}` : '--',
    validity: profile?.insurance?.validUntil ? new Date(profile.insurance.validUntil).toLocaleDateString() : '--',
    totalSubmissions: profile?.plots?.length || 0,
    approvedClaims: 0,
    pendingClaims: 0,
    totalAmount: '₹ 0',
  };

  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [notifications, setNotifications] = useState(true);
  const [autoCapture, setAutoCapture] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [selectedApiKey, setSelectedApiKey] = useState('');
  const [editValue, setEditValue] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/auth/splash') },
      ]
    );
  };

  const handleDeactivate = () => {
    Alert.alert(
      'Deactivate Account',
      'This will permanently delete your account and all data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deactivate', style: 'destructive', onPress: () => {
          Alert.alert('Account Deactivated', 'Your account has been deactivated successfully');
          router.replace('/auth/splash');
        }},
      ]
    );
  };

  const handleEditField = (label: string, apiKey: string, value: string) => {
    setSelectedField(label);
    setSelectedApiKey(apiKey);
    setEditValue(value);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    try {
      const updateData = { [selectedApiKey]: editValue };
      
      const response = await fetch(API_ENDPOINTS.FARMERS.PROFILE, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', `${selectedField} updated successfully`);
        fetchFarmerProfile();
      } else {
        Alert.alert('Error', data.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Connection failed');
    } finally {
      setEditModalVisible(false);
    }
  };

  const menuItems = [
    {
      icon: 'user',
      title: 'Personal Information',
      description: 'View and update your personal details',
      color: COLORS.primary,
      screen: 'personal',
    },
    {
      icon: 'map-pin',
      title: 'Address Details',
      description: 'Update your residential address',
      color: '#4CAF50',
      screen: 'address',
    },
    {
      icon: 'credit-card',
      title: 'Bank Details',
      description: 'Manage your bank account information',
      color: '#2196F3',
      screen: 'bank',
    },
    {
      icon: 'shield',
      title: 'Insurance Details',
      description: 'View your insurance coverage',
      color: '#9C27B0',
      screen: 'insurance',
    },
    {
      icon: 'bell',
      title: 'Notifications',
      description: 'Manage notification preferences',
      color: '#FF9800',
      screen: 'notifications',
    },
    {
      icon: 'globe',
      title: 'Language',
      description: 'Change app language',
      color: '#795548',
      screen: 'language',
    },
    {
      icon: 'lock',
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      color: '#607D8B',
      screen: 'privacy',
    },
    {
      icon: 'help-circle',
      title: 'Help & Support',
      description: 'Get help and contact support',
      color: '#FF5722',
      screen: 'help',
    },
    {
      icon: 'file-text',
      title: 'Terms & Conditions',
      description: 'Read our terms and conditions',
      color: '#00BCD4',
      screen: 'terms',
    },
  ];

  const stats = [
    { label: 'Total Submissions', value: displayData.totalSubmissions, icon: 'upload' },
    { label: 'Approved Claims', value: displayData.approvedClaims, icon: 'check-circle' },
    { label: 'Pending Claims', value: displayData.pendingClaims, icon: 'clock' },
    { label: 'Total Amount', value: displayData.totalAmount, icon: 'rupee' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {displayData.fullName.split(' ').map((n: string) => n[0]).join('')}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Feather name="camera" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{displayData.fullName}</Text>
              <Text style={styles.farmerId}>ID: {displayData.pmfbyId}</Text>
              <Text style={styles.location}>
                <Feather name="map-pin" size={14} /> {displayData.address}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Feather name={isEditing ? 'check' : 'edit-2'} size={20} color={COLORS.primary} />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Done' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: COLORS.primary || COLORS.tertiary + '20' }]}>
                <Feather name={stat.icon as any} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Full Name</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Full Name', 'name', displayData.fullName)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.fullName}</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Father's Name</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Father\'s Name', 'fatherName', displayData.fatherName)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.fatherName}</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Mobile Number</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Mobile Number', 'contact.phone', displayData.mobile)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.mobile}</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Email</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Email', 'contact.email', displayData.email)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Age</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Age', 'age', displayData.age.toString())}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.age} years</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Gender</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Gender', 'gender', displayData.gender)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.gender}</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Farmer Type</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Farmer Type', 'farmerType', displayData.farmerType)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.farmerType}</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Category</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Category', 'farmerCategory', displayData.farmerCategory)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.farmerCategory}</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.infoLabel}>Aadhaar (UID)</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Aadhaar', 'uidNumber', displayData.uidNumber)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.infoValue}>{displayData.uidNumber}</Text>
            </View>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Address Details</Text>
          </View>
          
          <View style={styles.addressCard}>
            <View style={styles.infoLabelRow}>
              <Text style={styles.addressLabel}>Full Address</Text>
              {isEditing && (
                <TouchableOpacity onPress={() => handleEditField('Address', 'location.address', displayData.address)}>
                  <Feather name="edit-2" size={12} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.addressText}>{displayData.address}</Text>
            
            <View style={styles.addressDetails}>
              <View style={styles.addressItem}>
                <View style={styles.infoLabelRow}>
                  <Text style={styles.addressLabel}>State</Text>
                  {isEditing && (
                    <TouchableOpacity onPress={() => handleEditField('State', 'location.region', displayData.state)}>
                      <Feather name="edit-2" size={12} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.addressValue}>{displayData.state}</Text>
              </View>
              <View style={styles.addressItem}>
                <View style={styles.infoLabelRow}>
                  <Text style={styles.addressLabel}>District</Text>
                  {isEditing && (
                    <TouchableOpacity onPress={() => handleEditField('District', 'location.district', displayData.district)}>
                      <Feather name="edit-2" size={12} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.addressValue}>{displayData.district}</Text>
              </View>
              <View style={styles.addressItem}>
                <View style={styles.infoLabelRow}>
                  <Text style={styles.addressLabel}>Pincode</Text>
                  {isEditing && (
                    <TouchableOpacity onPress={() => handleEditField('Pincode', 'location.pincode', displayData.pincode)}>
                      <Feather name="edit-2" size={12} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.addressValue}>{displayData.pincode}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bank & Insurance */}
        <View style={styles.rowSection}>
          <View style={[styles.section, styles.halfSection]}>
            <View style={styles.sectionHeader}>
              <Feather name="credit-card" size={18} color="#2196F3" />
              <Text style={styles.sectionTitle}>Bank Details</Text>
            </View>
            
            <View style={styles.bankCard}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.bankName}>{displayData.bankName}</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleEditField('Bank Name', 'bank.bankName', displayData.bankName)}>
                    <Feather name="edit-2" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.bankDetails}>
                <View style={styles.infoLabelRow}>
                  <Text style={styles.bankLabel}>Account No.</Text>
                  {isEditing && (
                    <TouchableOpacity onPress={() => handleEditField('Account No.', 'bank.accountNumber', displayData.accountNumber)}>
                      <Feather name="edit-2" size={12} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.bankValue}>{displayData.accountNumber}</Text>
              </View>
              <View style={styles.bankDetails}>
                <View style={styles.infoLabelRow}>
                  <Text style={styles.bankLabel}>IFSC Code</Text>
                  {isEditing && (
                    <TouchableOpacity onPress={() => handleEditField('IFSC Code', 'bank.ifscCode', displayData.ifscCode)}>
                      <Feather name="edit-2" size={12} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.bankValue}>{displayData.ifscCode}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.section, styles.halfSection]}>
            <View style={styles.sectionHeader}>
              <Feather name="shield" size={18} color="#9C27B0" />
              <Text style={styles.sectionTitle}>Insurance</Text>
            </View>
            
            <View style={styles.insuranceCard}>
              <Text style={styles.insuranceAmount}>{displayData.insuranceCoverage}</Text>
              <Text style={styles.insuranceLabel}>Sum Insured</Text>
              <View style={styles.insuranceDetails}>
                <View style={styles.insuranceItem}>
                  <Text style={styles.insuranceDetailLabel}>Premium</Text>
                  <Text style={styles.insuranceDetailValue}>{displayData.premiumPaid}</Text>
                </View>
                <View style={styles.insuranceItem}>
                  <Text style={styles.insuranceDetailLabel}>Valid Till</Text>
                  <Text style={styles.insuranceDetailValue}>{displayData.validity}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="settings" size={20} color={COLORS.gray} />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          
          <View style={styles.settingsList}>
            {/* Language Toggle */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: '#79554820' }]}>
                  <Feather name="globe" size={18} color="#795548" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>App Language</Text>
                  <Text style={styles.settingDescription}>
                    Current: {language === 'english' ? 'English' : 'हिंदी'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.languageToggle}
                onPress={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
              >
                <Text style={styles.languageText}>
                  {language === 'english' ? 'हिंदी' : 'English'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Notifications Toggle */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: '#FF980020' }]}>
                  <Feather name="bell" size={18} color="#FF9800" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive updates about your submissions
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary + '80' }}
                thumbColor={notifications ? COLORS.primary : COLORS.white}
              />
            </View>

            {/* Auto Capture Toggle */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: COLORS.primary + '20' }]}>
                  <Feather name="camera" size={18} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Smart Auto-Capture</Text>
                  <Text style={styles.settingDescription}>
                    Auto capture when image quality is optimal
                  </Text>
                </View>
              </View>
              <Switch
                value={autoCapture}
                onValueChange={setAutoCapture}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary + '80' }}
                thumbColor={autoCapture ? COLORS.primary : COLORS.white}
              />
            </View>

            {/* Data Usage */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: '#00BCD420' }]}>
                  <Feather name="wifi" size={18} color="#00BCD4" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Data Usage</Text>
                  <Text style={styles.settingDescription}>
                    Manage mobile data usage for uploads
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            {/* Clear Cache */}
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, { backgroundColor: '#FF572220' }]}>
                  <Feather name="trash-2" size={18} color="#FF5722" />
                </View>
                <View>
                  <Text style={styles.settingTitle}>Clear Cache</Text>
                  <Text style={styles.settingDescription}>
                    Free up storage space
                  </Text>
                </View>
              </View>
              <Text style={styles.cacheSize}>128 MB</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.slice(4).map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Feather name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.supportButton}>
            <Feather name="phone-call" size={18} color={COLORS.white} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          <View style={styles.dangerActions}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Feather name="log-out" size={18} color={COLORS.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.deactivateButton} onPress={handleDeactivate}>
              <Feather name="trash-2" size={16} color={COLORS.error} />
              <Text style={styles.deactivateText}>Deactivate Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>PMFBY Farmer App v2.4.1</Text>
          <Text style={styles.copyrightText}>© 2024 Government of India</Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {selectedField}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter new ${selectedField.toLowerCase()}`}
              placeholderTextColor={COLORS.gray}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 4,
  },
  farmerId: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: COLORS.gray,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    flex: 1,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
  },
  addressCard: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 10,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 20,
    marginBottom: 15,
  },
  addressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 15,
  },
  addressItem: {
    alignItems: 'center',
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rowSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
    gap: 10,
  },
  halfSection: {
    flex: 1,
    marginHorizontal: 0,
  },
  bankCard: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 10,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  bankDetails: {
    marginBottom: 10,
  },
  bankLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  bankValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
  },
  insuranceCard: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  insuranceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 5,
  },
  insuranceLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 15,
  },
  insuranceDetails: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  insuranceItem: {
    alignItems: 'center',
  },
  insuranceDetailLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  insuranceDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
  },
  settingsList: {
    gap: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: COLORS.gray,
  },
  languageToggle: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  cacheSize: {
    fontSize: 12,
    color: COLORS.gray,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: COLORS.gray,
  },
  actionContainer: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  supportButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
    marginBottom: 15,
  },
  supportButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.error + '10',
    borderRadius: 10,
    gap: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  deactivateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.error + '10',
    borderRadius: 10,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  deactivateText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 11,
    color: COLORS.gray,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: COLORS.content,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.content,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});