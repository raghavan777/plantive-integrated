// /home/ashith/Plantive/app/farmer/history.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  Alert,
  FlatList,
  Modal,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

// Import colors
import { COLORS } from '../../constants/colors';
import { API_ENDPOINTS, getAuthHeaders } from '../../constants/api';

// Mock data for submissions (DELETED)
const MOCK_SUBMISSIONS: any[] = [];

export default function HistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedId = params.id as string;
  
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS.HISTORY, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        // Map backend data to UI structure
        const mapped = data.data.map((sub: any) => ({
          id: sub.submissionId || sub._id,
          date: new Date(sub.createdAt).toLocaleString(),
          cropType: sub.plot?.cropType || 'Crop',
          cropStage: sub.data?.cropStage || 'Vegetative',
          status: sub.status === 'verified' ? 'completed' : sub.status,
          imageUri: sub.images?.[0]?.url || 'https://via.placeholder.com/400',
          aiResult: sub.data?.aiAnalysis || 'Healthy crop detected.',
          officerComments: sub.verification?.comments || '',
        }));
        setSubmissions(mapped);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Set selected submission if ID is provided
  useEffect(() => {
    if (selectedId && submissions.length > 0) {
      const submission = submissions.find(sub => sub.id === selectedId);
      if (submission) {
        setSelectedItem(submission);
        setShowDetailsModal(true);
      }
    }
  }, [selectedId, submissions]);

  // Filter submissions based on selected filter
  const filteredSubmissions = submissions.filter(sub => {
    if (selectedFilter === 'all') return true;
    return sub.status === selectedFilter;
  });

  // Refresh submissions
  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchSubmissions();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // View submission details
  const viewSubmissionDetails = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedItem(null);
  };

  // Share submission details
  const shareSubmissionDetails = async (item: any) => {
    try {
      await Share.share({
        message: `PMFBY Submission Details\n\nID: ${item.id}\nCrop: ${item.cropType}\nStage: ${item.cropStage}\nStatus: ${getStatusInfo(item.status).text}\nDate: ${item.date}\nAI Result: ${item.aiResult}\nOfficer Comments: ${item.officerComments || 'Not available'}\n\nSubmitted via PMFBY-CROPIC App`,
        title: 'PMFBY Crop Submission',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Copy submission ID to clipboard
  const copyToClipboard = async (id: string) => {
    await Clipboard.setStringAsync(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Submission ID copied to clipboard');
  };

  // Get status color and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: COLORS.success, text: 'Completed', icon: 'checkmark-circle' };
      case 'in-progress':
        return { color: COLORS.info, text: 'In Progress', icon: 'time' };
      case 'pending':
        return { color: COLORS.warning, text: 'Pending', icon: 'hourglass' };
      default:
        return { color: COLORS.gray, text: 'Unknown', icon: 'help-circle' };
    }
  };

  // Render submission item
  const renderSubmissionItem = ({ item }: { item: any }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <TouchableOpacity
        style={styles.submissionCard}
        onPress={() => viewSubmissionDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.submissionHeader}>
          <View style={styles.submissionIdContainer}>
            <Ionicons name="document-text" size={16} color={COLORS.gray} />
            <Text style={styles.submissionId} numberOfLines={1}>
              {item.id.substring(0, 15)}...
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
            <Ionicons name={statusInfo.icon as any} size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View style={styles.submissionContent}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.submissionImage}
            resizeMode="cover"
          />
          
          <View style={styles.submissionDetails}>
            <Text style={styles.cropName}>{item.cropType}</Text>
            <Text style={styles.cropStage}>{item.cropStage} Stage</Text>
            <Text style={styles.submissionDate}>{item.date}</Text>
            
            <View style={styles.aiResultContainer}>
              <Ionicons name="analytics" size={14} color={COLORS.primary} />
              <Text style={styles.aiResultText} numberOfLines={2}>
                {item.aiResult}
              </Text>
            </View>
            
            {item.officerComments && (
              <View style={styles.commentsContainer}>
                <Ionicons name="chatbubble" size={14} color={COLORS.secondary} />
                <Text style={styles.commentsText} numberOfLines={2}>
                  {item.officerComments}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.submissionFooter}>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => viewSubmissionDetails(item)}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter buttons
  const renderFilterButton = (filter: 'all' | 'pending' | 'in-progress' | 'completed', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedFilter(filter);
      }}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
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
          <Text style={styles.title}>Submission History</Text>
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={() => {
              Alert.alert(
                'Sort Options',
                'Select sorting option',
                [
                  { text: 'Date (Newest First)', onPress: () => {} },
                  { text: 'Date (Oldest First)', onPress: () => {} },
                  { text: 'Crop Type (A-Z)', onPress: () => {} },
                  { text: 'Status', onPress: () => {} },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <Ionicons name="filter" size={20} color={COLORS.content} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{submissions.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {submissions.filter(s => s.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {submissions.filter(s => s.status === 'in-progress').length}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {submissions.filter(s => s.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {renderFilterButton('all', 'All')}
          {renderFilterButton('completed', 'Completed')}
          {renderFilterButton('in-progress', 'In Progress')}
          {renderFilterButton('pending', 'Pending')}
        </ScrollView>

        {/* Submissions List */}
        {filteredSubmissions.length > 0 ? (
          <FlatList
            data={filteredSubmissions}
            renderItem={renderSubmissionItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            ListFooterComponent={<View style={styles.footerSpacer} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>No Submissions Found</Text>
            <Text style={styles.emptyText}>
              {selectedFilter === 'all'
                ? 'You haven\'t made any submissions yet'
                : `No ${selectedFilter} submissions found`}
            </Text>
            <TouchableOpacity
              style={styles.newSubmissionButton}
              onPress={() => router.push('/farmer/capture')}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.newSubmissionGradient}
              >
                <Ionicons name="camera" size={20} color={COLORS.white} />
                <Text style={styles.newSubmissionText}>Capture New Image</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDetailsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <ScrollView 
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Submission Details</Text>
                  <TouchableOpacity 
                    onPress={closeDetailsModal}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color={COLORS.gray} />
                  </TouchableOpacity>
                </View>

                {/* Submission ID */}
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Submission ID</Text>
                  <View style={styles.idContainer}>
                    <Text style={styles.idText}>{selectedItem.id}</Text>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => copyToClipboard(selectedItem.id)}
                    >
                      <Ionicons name="copy" size={16} color={COLORS.primary} />
                      <Text style={styles.copyText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Image Preview */}
                <Image
                  source={{ uri: selectedItem.imageUri }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                {/* Crop Details */}
                <View style={styles.modalRow}>
                  <View style={styles.modalColumn}>
                    <Text style={styles.modalLabel}>Crop Type</Text>
                    <Text style={styles.modalValue}>{selectedItem.cropType}</Text>
                  </View>
                  <View style={styles.modalColumn}>
                    <Text style={styles.modalLabel}>Crop Stage</Text>
                    <Text style={styles.modalValue}>{selectedItem.cropStage}</Text>
                  </View>
                </View>

                {/* Date and Status */}
                <View style={styles.modalRow}>
                  <View style={styles.modalColumn}>
                    <Text style={styles.modalLabel}>Date & Time</Text>
                    <Text style={styles.modalValue}>{selectedItem.date}</Text>
                  </View>
                  <View style={styles.modalColumn}>
                    <Text style={styles.modalLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusInfo(selectedItem.status).color}20` }]}>
                      <Ionicons name={getStatusInfo(selectedItem.status).icon as any} size={14} color={getStatusInfo(selectedItem.status).color} />
                      <Text style={[styles.statusText, { color: getStatusInfo(selectedItem.status).color }]}>
                        {getStatusInfo(selectedItem.status).text}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* AI Result */}
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>AI Analysis Result</Text>
                  <View style={styles.aiResultBox}>
                    <Ionicons name="analytics" size={20} color={COLORS.primary} style={styles.aiIcon} />
                    <Text style={styles.aiResultText}>{selectedItem.aiResult}</Text>
                  </View>
                </View>

                {/* Officer Comments */}
                {selectedItem.officerComments && (
                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>Officer Comments</Text>
                    <View style={styles.commentsBox}>
                      <Ionicons name="chatbubble" size={20} color={COLORS.secondary} style={styles.commentsIcon} />
                      <Text style={styles.commentsText}>{selectedItem.officerComments}</Text>
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.shareButton]}
                    onPress={() => shareSubmissionDetails(selectedItem)}
                  >
                    <Ionicons name="share" size={20} color={COLORS.primary} />
                    <Text style={styles.shareButtonText}>Share Details</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeModalButton]}
                    onPress={closeDetailsModal}
                  >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
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
  filterIcon: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  filterContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  filterContent: {
    paddingVertical: 5,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  submissionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  submissionIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  submissionId: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 6,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  submissionContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  submissionImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: COLORS.lightGray,
  },
  submissionDetails: {
    flex: 1,
    marginLeft: 15,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 2,
  },
  cropStage: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
  submissionDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  aiResultContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  aiResultText: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentsText: {
    fontSize: 13,
    color: COLORS.secondary,
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  submissionFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  newSubmissionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  newSubmissionGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newSubmissionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footerSpacer: {
    height: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  closeButton: {
    padding: 4,
  },
  modalField: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 16,
    color: COLORS.content,
    fontWeight: '600',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  idText: {
    fontSize: 14,
    color: COLORS.content,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: COLORS.lightGray,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalColumn: {
    flex: 1,
  },
  aiResultBox: {
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  commentsBox: {
    backgroundColor: 'rgba(118, 160, 106, 0.1)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentsIcon: {
    marginRight: 10,
    marginTop: 2,
  },
   
  modalActions: {
    marginTop: 25,
    gap: 12,
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  shareButton: {
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  shareButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  closeModalButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  closeModalButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: '600',
  },
});