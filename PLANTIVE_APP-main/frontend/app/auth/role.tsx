import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../../constants/colors';
import { router } from 'expo-router';

export default function RoleSelectionScreen() {
  const handleRoleSelect = (role: 'farmer' | 'official') => {
    if (role === 'farmer') {
      router.push('/auth/farmer/login');
    } else {
      router.push('/auth/official/login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>अपनी भूमिका चुनें</Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('farmer')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👨‍🌾</Text>
          </View>
          <Text style={styles.roleTitle}>Farmer</Text>
          <Text style={styles.roleSubtitle}>किसान</Text>
          <Text style={styles.roleDescription}>
            Upload crop images, track claims, get AI analysis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('official')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👨‍💼</Text>
          </View>
          <Text style={styles.roleTitle}>Field Official</Text>
          <Text style={styles.roleSubtitle}>क्षेत्र अधिकारी</Text>
          <Text style={styles.roleDescription}>
            Verify crops, submit reports, manage assigned farms
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.gray,
  },
  roleContainer: {
    gap: 30,
  },
  roleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.tertiary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: COLORS.primary,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  roleSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 15,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});