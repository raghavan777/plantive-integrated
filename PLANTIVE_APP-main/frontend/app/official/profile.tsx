// /home/ashith/Plantive/app/official/profile.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import colors
import { COLORS } from '../../constants/colors';

// Mock official data
const OFFICIAL_DATA = {
  name: 'Dr. Arjun Sharma',
  designation: 'Agriculture Field Officer',
  employeeId: 'AGRI-OFF-2023-045',
  department: 'Department of Agriculture',
  zone: 'Chennai South Zone',
  phone: '+91 98765 43210',
  email: 'arjun.sharma@agri.tn.gov.in',
  experience: '8 years',
  totalVisits: 145,
  completedVisits: 132,
  rating: 4.7,
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop',
};

export default function OfficialProfileScreen() {
  const router = useRouter();
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'documents'>('profile');

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowLogoutModal(false);
    router.replace('/auth/official/login');
  };

  const handleSyncNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Sync Started',
      'Syncing offline data with server...',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    router.push('/auth/official/change-password');
  };

  const handleViewAssignments = () => {
    router.push('/official/assignments');
  };

  const handlePerformance = () => {
    Alert.alert(
      'Performance Metrics',
      'Monthly Report:\n\n• Visits Completed: 32/35\n• Average Rating: 4.7/5\n• Response Time: 2.3 hrs\n• AI Match Accuracy: 89%\n\nStatus: Excellent',
      [{ text: 'OK' }]
    );
  };

  const renderProfileSection = () => (
    <View style={styles.section}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: OFFICIAL_DATA.avatar }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.profileInfo}>
          <Text style={styles.officialName}>{OFFICIAL_DATA.name}</Text>
          <Text style={styles.designation}>{OFFICIAL_DATA.designation}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{OFFICIAL_DATA.rating}/5</Text>
            <Text style={styles.experienceText}> • {OFFICIAL_DATA.experience} experience</Text>
          </View>
        </View>
      </View>

      {/* Official Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="id-card" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Employee ID</Text>
            <Text style={styles.detailValue}>{OFFICIAL_DATA.employeeId}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome5 name="building" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Department</Text>
            <Text style={styles.detailValue}>{OFFICIAL_DATA.department}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Zone</Text>
            <Text style={styles.detailValue}>{OFFICIAL_DATA.zone}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{OFFICIAL_DATA.phone}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="mail" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{OFFICIAL_DATA.email}</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statCard} onPress={handleViewAssignments}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.statGradient}
          >
            <Text style={styles.statNumber}>{OFFICIAL_DATA.totalVisits}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={handlePerformance}>
          <LinearGradient
            colors={[COLORS.success, '#00cc00']}
            style={styles.statGradient}
          >
            <Text style={styles.statNumber}>{OFFICIAL_DATA.completedVisits}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={handlePerformance}>
          <LinearGradient
            colors={[COLORS.info, '#0066cc']}
            style={styles.statGradient}
          >
            <Text style={styles.statNumber}>{OFFICIAL_DATA.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewAssignments}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.actionGradient}
          >
            <Ionicons name="list" size={22} color={COLORS.white} />
            <Text style={styles.actionText}>View Assignments</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSyncNow}
        >
          <LinearGradient
            colors={[COLORS.secondary, COLORS.tertiary]}
            style={styles.actionGradient}
          >
            <Ionicons name="sync" size={22} color={COLORS.white} />
            <Text style={styles.actionText}>Sync Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>App Settings</Text>
      
      {/* Notification Settings */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="notifications" size={24} color={COLORS.primary} />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive alerts for new assignments</Text>
          </View>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>

      {/* Auto Sync */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="cloud-upload" size={24} color={COLORS.primary} />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Auto Sync</Text>
            <Text style={styles.settingDescription}>Automatically sync offline data</Text>
          </View>
        </View>
        <Switch
          value={autoSync}
          onValueChange={setAutoSync}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>

      {/* Dark Mode */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="moon" size={24} color={COLORS.primary} />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Use dark theme</Text>
          </View>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
      </View>

      {/* Language */}
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="language" size={24} color={COLORS.primary} />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Language</Text>
            <Text style={styles.settingDescription}>English</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
      </TouchableOpacity>

      {/* Change Password */}
      <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
        <View style={styles.settingLeft}>
          <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Change Password</Text>
            <Text style={styles.settingDescription}>Update your login password</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
      </TouchableOpacity>

      {/* Data Usage */}
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="stats-chart" size={24} color={COLORS.primary} />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Data Usage</Text>
            <Text style={styles.settingDescription}>Manage app data and cache</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
      </TouchableOpacity>

      {/* About App */}
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>About App</Text>
            <Text style={styles.settingDescription}>Version 2.1.0 • PMFBY-CROPIC</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  );

  const renderDocumentsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Official Documents</Text>
      
      {/* ID Card */}
      <TouchableOpacity style={styles.documentItem}>
        <View style={styles.documentIcon}>
          <Ionicons name="id-card" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.documentContent}>
          <Text style={styles.documentTitle}>Official ID Card</Text>
          <Text style={styles.documentStatus}>Verified • Expires: Dec 2024</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Appointment Letter */}
      <TouchableOpacity style={styles.documentItem}>
        <View style={styles.documentIcon}>
          <Ionicons name="document-text" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.documentContent}>
          <Text style={styles.documentTitle}>Appointment Letter</Text>
          <Text style={styles.documentStatus}>On File • Dated: 15/03/2020</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Training Certificates */}
      <TouchableOpacity style={styles.documentItem}>
        <View style={styles.documentIcon}>
          <MaterialIcons name="school" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.documentContent}>
          <Text style={styles.documentTitle}>Training Certificates</Text>
          <Text style={styles.documentStatus}>3 Certificates • Latest: 2023</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Authority Letter */}
      <TouchableOpacity style={styles.documentItem}>
        <View style={styles.documentIcon}>
          <FontAwesome5 name="stamp" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.documentContent}>
          <Text style={styles.documentTitle}>Verification Authority</Text>
          <Text style={styles.documentStatus}>Active • District Level</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Performance Reports */}
      <TouchableOpacity style={styles.documentItem}>
        <View style={styles.documentIcon}>
          <Ionicons name="trophy" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.documentContent}>
          <Text style={styles.documentTitle}>Performance Reports</Text>
          <Text style={styles.documentStatus}>Quarterly • Last: Q3 2023</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Upload New */}
      <TouchableOpacity style={styles.uploadButton}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.uploadGradient}
        >
          <Ionicons name="cloud-upload" size={22} color={COLORS.white} />
          <Text style={styles.uploadText}>Upload New Document</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.white]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.content} />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={22} color={COLORS.warning} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveTab('profile');
            }}
          >
            <Ionicons 
              name="person" 
              size={20} 
              color={activeTab === 'profile' ? COLORS.primary : COLORS.gray} 
            />
            <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveTab('settings');
            }}
          >
            <Ionicons 
              name="settings" 
              size={20} 
              color={activeTab === 'settings' ? COLORS.primary : COLORS.gray} 
            />
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'documents' && styles.activeTab]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveTab('documents');
            }}
          >
            <Ionicons 
              name="folder" 
              size={20} 
              color={activeTab === 'documents' ? COLORS.primary : COLORS.gray} 
            />
            <Text style={[styles.tabText, activeTab === 'documents' && styles.activeTabText]}>
              Documents
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Content based on active tab */}
          {activeTab === 'profile' && renderProfileSection()}
          {activeTab === 'settings' && renderSettingsSection()}
          {activeTab === 'documents' && renderDocumentsSection()}

          {/* Support Section */}
          <View style={styles.supportSection}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <View style={styles.supportOptions}>
              <TouchableOpacity style={styles.supportOption}>
                <Ionicons name="help-circle" size={24} color={COLORS.info} />
                <Text style={styles.supportOptionText}>FAQs</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.supportOption}>
                <Ionicons name="call" size={24} color={COLORS.success} />
                <Text style={styles.supportOptionText}>Support</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.supportOption}>
                <Ionicons name="mail" size={24} color={COLORS.primary} />
                <Text style={styles.supportOptionText}>Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.supportOption}>
                <Ionicons name="document-text" size={24} color={COLORS.warning} />
                <Text style={styles.supportOptionText}>Manual</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerSpacer} />
        </ScrollView>
      </LinearGradient>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="log-out" size={40} color={COLORS.warning} />
              <Text style={styles.modalTitle}>Logout Confirmation</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Are you sure you want to logout? Any unsynced data will be saved locally.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <LinearGradient
                  colors={[COLORS.warning, '#ff6600']}
                  style={styles.confirmGradient}
                >
                  <Text style={styles.confirmButtonText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
    textAlign: 'center',
    flex: 1,
  },
  logoutButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
    marginLeft: 6,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightGray,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  officialName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 4,
  },
  designation: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.content,
    fontWeight: '600',
    marginLeft: 4,
  },
  experienceText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailsContainer: {
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.content,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionGradient: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.gray,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  documentIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 4,
  },
  documentStatus: {
    fontSize: 13,
    color: COLORS.gray,
  },
  downloadButton: {
    padding: 8,
  },
  uploadButton: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  uploadGradient: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  supportSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
    textAlign: 'center',
  },
  supportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  supportOption: {
    alignItems: 'center',
    padding: 10,
  },
  supportOptionText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 6,
  },
  footerSpacer: {
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  cancelButtonText: {
    paddingVertical: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
  },
  confirmButton: {
    elevation: 3,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmGradient: {
    paddingVertical: 15,
  },
  confirmButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});