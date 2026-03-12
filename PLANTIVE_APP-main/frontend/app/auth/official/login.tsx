import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../../../constants/colors';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { router } from 'expo-router';

export default function OfficialLoginScreen() {
  const [officialId, setOfficialId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState('OFF123');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let newCaptcha = '';
    for (let i = 0; i < 6; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(newCaptcha);
  };

  const handleSubmit = () => {
    if (!captcha || captcha.toUpperCase() !== captchaCode) {
      Alert.alert('Error', 'Invalid captcha code');
      return;
    }

    if (isLogin) {
      // Login validation
      if (!officialId || !password) {
        Alert.alert('Error', 'Please enter Official ID and Password');
        return;
      }
    } else {
      // Registration validation
      if (!officialId || !phoneNumber || !username || !password || !email) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', isLogin ? 'Login successful!' : 'Registration successful!');
      router.replace('/official/home');
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Field Official</Text>
        <Text style={styles.subtitle}>क्षेत्र अधिकारी</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Government Official Access</Text>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isLogin && styles.toggleActive]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isLogin && styles.toggleActive]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {!isLogin && (
          <>
            <Input
              label="Official ID *"
              placeholder="Enter your government official ID"
              value={officialId}
              onChangeText={setOfficialId}
            />
            <Input
              label="Phone Number *"
              placeholder="Enter 10-digit mobile number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <Input
              label="Username *"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
            />
          </>
        )}

        {isLogin && (
          <Input
            label="Official ID *"
            placeholder="Enter your official ID"
            value={officialId}
            onChangeText={setOfficialId}
          />
        )}

        <Input
          label={isLogin ? "Password *" : "Create Password *"}
          placeholder={isLogin ? "Enter your password" : "Create a strong password"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {!isLogin && (
          <Input
            label="Email ID *"
            placeholder="Enter official email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        )}

        <View style={styles.captchaContainer}>
          <Text style={styles.captchaLabel}>Security Verification</Text>
          <View style={styles.captchaBox}>
            <Text style={styles.captchaText}>{captchaCode}</Text>
            <TouchableOpacity onPress={refreshCaptcha} style={styles.refreshButton}>
              <Text style={styles.refreshIcon}>🔄</Text>
            </TouchableOpacity>
          </View>
          <Input
            placeholder="Enter the code above"
            value={captcha}
            onChangeText={setCaptcha}
            style={styles.captchaInput}
          />
        </View>

        <Button
          title={isLogin ? "Login as Official" : "Register as Official"}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />

        {isLogin ? (
          <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(false)}>
            <Text style={styles.switchText}>
              New Official? <Text style={styles.switchHighlight}>Register here</Text>
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(true)}>
            <Text style={styles.switchText}>
              Already registered? <Text style={styles.switchHighlight}>Login here</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Government of India</Text>
        <Text style={styles.footerSubtext}>PMFBY - Crop Insurance Portal</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.gray,
    marginBottom: 15,
  },
  roleBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  roleText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 30,
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  form: {
    gap: 20,
  },
  captchaContainer: {
    gap: 10,
  },
  captchaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  captchaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 15,
  },
  captchaText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 5,
    color: COLORS.content,
  },
  refreshButton: {
    padding: 5,
  },
  refreshIcon: {
    fontSize: 24,
  },
  captchaInput: {
    marginTop: 10,
  },
  submitButton: {
    marginTop: 10,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  switchText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  switchHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.gray,
  },
});