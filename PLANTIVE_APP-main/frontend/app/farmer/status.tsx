import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';
import { API_ENDPOINTS, getAuthHeaders } from '../../constants/api';

export default function FarmerStatusScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [statusData, setStatusData] = useState<any[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const fetchStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS.STATUS, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        const mapped = data.data.map((sub: any) => {
          // Define steps based on status
          const steps = [
            { title: 'Submitted', time: new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
            { title: 'AI Analysis', time: sub.status !== 'pending' ? 'Completed' : 'Processing', completed: sub.status !== 'pending' },
            { title: 'Verification', time: sub.status === 'verified' ? 'Verified' : 'Pending', completed: sub.status === 'verified' },
            { title: 'Approval', time: sub.status === 'verified' ? 'Approved' : 'Pending', completed: sub.status === 'verified' },
          ];

          return {
            id: sub.submissionId || sub._id,
            crop: sub.plot?.cropType || 'Crop',
            stage: sub.data?.cropStage || 'Vegetative',
            date: new Date(sub.createdAt).toLocaleDateString(),
            steps,
            status: sub.status === 'verified' ? 'approved' : 'processing',
            claimAmount: sub.status === 'verified' ? '₹ --' : 'Pending',
          };
        });
        setStatusData(mapped);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return COLORS.success;
      case 'processing': return COLORS.warning;
      case 'rejected': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'check-circle';
      case 'processing': return 'clock';
      case 'rejected': return 'x-circle';
      default: return 'file';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Text style={styles.headerTitle}>Claim Status</Text>
        <Text style={styles.headerSubtitle}>
          Track your crop submissions in real-time
        </Text>
      </Animated.View>

      {/* Stats Summary */}
      <Animated.View 
        style={[
          styles.statsCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.statItem}>
          <Feather name="upload" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{statusData.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Feather name="check-circle" size={24} color={COLORS.success} />
          <Text style={styles.statNumber}>{statusData.filter(i => i.status === 'approved').length}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Feather name="clock" size={24} color={COLORS.warning} />
          <Text style={styles.statNumber}>{statusData.filter(i => i.status === 'processing').length}</Text>
          <Text style={styles.statLabel}>Processing</Text>
        </View>
      </Animated.View>

      {/* Status List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {statusData.map((item, index) => (
            <View key={item.id} style={styles.statusCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cropName}>{item.crop}</Text>
                  <Text style={styles.cropStage}>{item.stage} Stage</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Feather 
                    name={getStatusIcon(item.status) as any} 
                    size={16} 
                    color={getStatusColor(item.status)} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status === 'approved' ? 'Approved' : 'Processing'}
                  </Text>
                </View>
              </View>

              {/* Submission Info */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Feather name="hash" size={14} color={COLORS.gray} />
                  <Text style={styles.infoText}>{item.id}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Feather name="calendar" size={14} color={COLORS.gray} />
                  <Text style={styles.infoText}>{item.date}</Text>
                </View>
              </View>

              {/* Timeline */}
              <View style={styles.timeline}>
                {item.steps.map((step: any, stepIndex: number) => (
                  <View key={stepIndex} style={styles.timelineStep}>
                    {/* Step Connector */}
                    {stepIndex < item.steps.length - 1 && (
                      <View style={[
                        styles.timelineLine,
                        step.completed && styles.timelineLineActive,
                      ]} />
                    )}
                    
                    {/* Step Circle */}
                    <View style={[
                      styles.timelineCircle,
                      step.completed && styles.timelineCircleActive,
                    ]}>
                      {step.completed && (
                        <Feather name="check" size={12} color={COLORS.white} />
                      )}
                    </View>
                    
                    {/* Step Info */}
                    <View style={styles.stepInfo}>
                      <Text style={[
                        styles.stepTitle,
                        step.completed && styles.stepTitleActive,
                      ]}>
                        {step.title}
                      </Text>
                      <Text style={styles.stepTime}>{step.time}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Claim Amount */}
              <View style={styles.claimContainer}>
                <Text style={styles.claimLabel}>Claim Amount:</Text>
                <Text style={[
                  styles.claimAmount,
                  item.status === 'approved' && styles.claimAmountApproved,
                ]}>
                  {item.claimAmount}
                </Text>
              </View>

              {/* Action Button */}
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>
                  {item.status === 'approved' ? 'View Details' : 'Check Progress'}
                </Text>
                <Feather name="chevron-right" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>

        {/* Help Card */}
        <View style={styles.helpCard}>
          <Feather name="help-circle" size={24} color={COLORS.primary} />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              Average processing time is 24-48 hours. Contact support if delayed.
            </Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => console.log('New submission')}
      >
        <Feather name="plus" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.lightGray,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 2,
  },
  cropStage: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  timeline: {
    marginBottom: 20,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 24,
    bottom: -15,
    width: 2,
    backgroundColor: COLORS.lightGray,
  },
  timelineLineActive: {
    backgroundColor: COLORS.primary,
  },
  timelineCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    zIndex: 1,
  },
  timelineCircleActive: {
    backgroundColor: COLORS.primary,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  stepTitleActive: {
    color: COLORS.content,
    fontWeight: '600',
  },
  stepTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  claimContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    marginBottom: 15,
  },
  claimLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  claimAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  claimAmountApproved: {
    color: COLORS.success,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
    gap: 15,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 2,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 16,
  },
  helpButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  helpButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});