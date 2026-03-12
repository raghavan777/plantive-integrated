import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { COLORS } from '../../constants/colors';
import { router } from 'expo-router';

interface FarmAssignment {
  id: string;
  farmerName: string;
  crop: string;
  location: string;
  deadline: string;
  status: 'new' | 'urgent' | 'pending';
  village: string;
  assignedDate: string;
}

export default function AssignmentsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'urgent' | 'pending'>('all');

  const assignments: FarmAssignment[] = [
    {
      id: 'A123',
      farmerName: 'Ramesh Patel',
      crop: 'Rice',
      location: 'Ramgarh',
      deadline: 'Today, 4 PM',
      status: 'urgent',
      village: 'Ramgarh',
      assignedDate: '2024-01-15',
    },
    {
      id: 'B456',
      farmerName: 'Suresh Yadav',
      crop: 'Wheat',
      location: 'Sohna',
      deadline: 'Tomorrow, 11 AM',
      status: 'new',
      village: 'Sohna',
      assignedDate: '2024-01-15',
    },
    {
      id: 'C789',
      farmerName: 'Anita Sharma',
      crop: 'Sugarcane',
      location: 'Badshahpur',
      deadline: 'Jan 18, 2 PM',
      status: 'pending',
      village: 'Badshahpur',
      assignedDate: '2024-01-14',
    },
    {
      id: 'D101',
      farmerName: 'Mohan Singh',
      crop: 'Cotton',
      location: 'Fazilpur',
      deadline: 'Jan 20, 10 AM',
      status: 'new',
      village: 'Fazilpur',
      assignedDate: '2024-01-14',
    },
    {
      id: 'E202',
      farmerName: 'Geeta Devi',
      crop: 'Maize',
      location: 'Kherla',
      deadline: 'Jan 17, 3 PM',
      status: 'urgent',
      village: 'Kherla',
      assignedDate: '2024-01-13',
    },
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.village.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || assignment.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleFarmSelect = (assignment: FarmAssignment) => {
    router.push({
      pathname: '/official/farm-details',
      params: { farmId: assignment.id }
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return styles.statusNew;
      case 'urgent':
        return styles.statusUrgent;
      case 'pending':
        return styles.statusPending;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'urgent':
        return 'Urgent';
      case 'pending':
        return 'Pending';
      default:
        return 'Active';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Assigned Farms</Text>
        <Text style={styles.subtitle}>Total: {assignments.length} farms assigned</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by farmer name, crop, or village..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.gray}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All Farms
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'new' && styles.filterButtonActive]}
          onPress={() => setFilter('new')}
        >
          <Text style={[styles.filterText, filter === 'new' && styles.filterTextActive]}>
            New
          </Text>
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>
              {assignments.filter(a => a.status === 'new').length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'urgent' && styles.filterButtonActive]}
          onPress={() => setFilter('urgent')}
        >
          <Text style={[styles.filterText, filter === 'urgent' && styles.filterTextActive]}>
            Urgent
          </Text>
          <View style={[styles.filterBadge, styles.filterBadgeUrgent]}>
            <Text style={styles.filterBadgeText}>
              {assignments.filter(a => a.status === 'urgent').length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
            Pending
          </Text>
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>
              {assignments.filter(a => a.status === 'pending').length}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Assignments List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          {filteredAssignments.length} Farms Found
        </Text>
        
        {filteredAssignments.map((assignment) => (
          <TouchableOpacity
            key={assignment.id}
            style={styles.farmCard}
            onPress={() => handleFarmSelect(assignment)}
          >
            <View style={styles.farmHeader}>
              <View>
                <Text style={styles.farmId}>Farm #{assignment.id}</Text>
                <Text style={styles.farmerName}>{assignment.farmerName}</Text>
              </View>
              <View style={[styles.statusBadge, getStatusStyle(assignment.status)]}>
                <Text style={styles.statusText}>{getStatusText(assignment.status)}</Text>
              </View>
            </View>

            <View style={styles.farmDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Crop</Text>
                  <Text style={styles.detailValue}>{assignment.crop}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Village</Text>
                  <Text style={styles.detailValue}>{assignment.village}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Assigned</Text>
                  <Text style={styles.detailValue}>{assignment.assignedDate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Deadline</Text>
                  <Text style={[styles.detailValue, styles.deadlineText]}>
                    {assignment.deadline}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.startButton, assignment.status === 'urgent' && styles.startButtonUrgent]}
                onPress={() => router.push('/official/verification')}
              >
                <Text style={styles.startButtonText}>Start Visit</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {filteredAssignments.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🌾</Text>
          <Text style={styles.emptyTitle}>No farms found</Text>
          <Text style={styles.emptyText}>
            {searchQuery ? 'Try a different search term' : 'No farms assigned with this filter'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.content,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterContent: {
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  filterBadge: {
    backgroundColor: COLORS.tertiary,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeUrgent: {
    backgroundColor: COLORS.error,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  listContainer: {
    padding: 20,
    gap: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
  },
  farmCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  farmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  farmId: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusNew: {
    backgroundColor: COLORS.primary + '20',
  },
  statusUrgent: {
    backgroundColor: COLORS.error + '20',
  },
  statusPending: {
    backgroundColor: COLORS.warning + '20',
  },
  statusDefault: {
    backgroundColor: COLORS.gray + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.content,
  },
  farmDetails: {
    gap: 15,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 30,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  deadlineText: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  viewButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  startButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonUrgent: {
    backgroundColor: COLORS.error,
  },
  startButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 50,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
});