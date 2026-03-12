import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { API_ENDPOINTS, setAuthToken } from '../../../constants/api';

// Colors
const COLORS = {
  primary: '#38a856',
  secondary: '#76a06a',
  tertiary: '#98be91',
  background: '#eff3ec',
  content: '#062905',
  white: '#ffffff',
  gray: '#888888',
  lightGray: '#e0e0e0',
  error: '#ff4444',
  warning: '#ff9800',
};

// Type for interval reference
type IntervalRef = ReturnType<typeof setInterval> | null;

export default function FarmerLoginScreen() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isOtpResendEnabled, setIsOtpResendEnabled] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Use ref for interval
  const intervalRef = useRef<IntervalRef>(null);

  // Handle OTP timer
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (otpSent && otpTimer > 0) {
      intervalRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setIsOtpResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [otpSent, otpTimer]);

  // Validate mobile number
  const isValidMobile = (number: string) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  // Send OTP Handler
  const handleSendOTP = async () => {
    setError('');
    
    if (!mobile.trim()) {
      setError('Mobile number is required');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!isValidMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SEND_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setLoading(false);
      setOtpSent(true);
      setStep('otp');
      setOtpTimer(60);
      setIsOtpResendEnabled(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'OTP Sent',
        'Please check your terminal (Backend Console) for the 6-digit OTP code.',
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      Alert.alert('Error', err.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    handleSendOTP();
  };

  // Verify OTP Handler
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter OTP');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: mobile,
          otp: otp 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      console.log('OTP verified successfully, storing token...');
      setAuthToken(data.token);
      
      setSuccess(`Welcome ${data.name}! Redirecting to dashboard...`);
      
      // Auto redirect after short delay
      setTimeout(() => {
        router.replace('/farmer/home');
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Verification Failed', err.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (step === 'otp') {
      setStep('mobile');
      setOtp('');
      setOtpSent(false);
      setOtpTimer(60);
      setIsOtpResendEnabled(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      router.back();
    }
  };

  // Format mobile number for display
  const formatMobileNumber = (num: string) => {
    if (num.length <= 5) return num;
    return `${num.slice(0, 5)} ${num.slice(5)}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[COLORS.background, COLORS.white]}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleBack}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.content} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Farmer Login</Text>
              <Text style={styles.subtitle}>किसान लॉगिन</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Success Message */}
            {success ? (
              <View style={styles.successAlert}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                <Text style={styles.successAlertText}>{success}</Text>
              </View>
            ) : null}
            {/* STEP 1: Mobile Number Input */}
            {step === 'mobile' && (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Mobile Number <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputWrapper, error && styles.inputError]}>
                    <Text style={styles.countryCode}>+91</Text>
                    <View style={styles.separator} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 10-digit mobile number"
                      placeholderTextColor={COLORS.gray}
                      value={mobile}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, '');
                        setMobile(cleaned);
                        setError('');
                      }}
                      keyboardType="phone-pad"
                      maxLength={10}
                      autoFocus={true}
                    />
                  </View>
                  {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : (
                    <Text style={styles.hintText}>
                      Enter your registered mobile number
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!mobile.trim() || mobile.length !== 10) && styles.buttonDisabled
                  ]}
                  onPress={handleSendOTP}
                  disabled={loading || !mobile.trim() || mobile.length !== 10}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <Text style={styles.buttonText}>Sending OTP...</Text>
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Send OTP</Text>
                        <Ionicons name="send-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.linksContainer}>
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => router.push('/auth/farmer/register')}
                  >
                    <Ionicons name="person-add-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.linkButtonText}>New User? Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 'otp' && (
              <View style={styles.form}>
                <View style={styles.otpHeader}>
                  <Text style={styles.otpTitle}>Enter OTP</Text>
                  <Text style={styles.otpSubtitle}>
                    Sent to <Text style={styles.mobileHighlight}>+91 {formatMobileNumber(mobile)}</Text>
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    OTP <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor={COLORS.gray}
                      value={otp}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, '');
                        setOtp(cleaned);
                      }}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus={true}
                    />
                  </View>
                  <Text style={styles.hintText}>
                    Enter the OTP sent to your mobile number
                  </Text>
                </View>

                <View style={styles.timerContainer}>
                  {!isOtpResendEnabled ? (
                    <Text style={styles.timerText}>
                      Resend OTP in {otpTimer}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendOTP}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={styles.demoHint}>
                    Demo: Check the alert message for OTP
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!otp.trim() || otp.length !== 6) && styles.buttonDisabled
                  ]}
                  onPress={handleVerifyOTP}
                  disabled={loading || !otp.trim() || otp.length !== 6}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <Text style={styles.buttonText}>Verifying...</Text>
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Verify OTP</Text>
                        <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setStep('mobile');
                    setOtp('');
                    setOtpSent(false);
                    setOtpTimer(60);
                    setIsOtpResendEnabled(false);
                    if (intervalRef.current) {
                      clearInterval(intervalRef.current);
                      intervalRef.current = null;
                    }
                  }}
                >
                  <Ionicons name="arrow-back-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.secondaryButtonText}>Change Mobile Number</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Information Box */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Use the same mobile number registered for your PMFBY account
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
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
  formContainer: {
    padding: 20,
  },
  form: {
    gap: 25,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 10,
  },
  required: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  countryCode: {
    fontSize: 16,
    color: COLORS.content,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: COLORS.content,
    paddingVertical: 0,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 8,
    marginLeft: 5,
  },
  hintText: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 8,
    marginLeft: 5,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  dividerText: {
    color: COLORS.gray,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  linksContainer: {
    alignItems: 'center',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  linkButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  otpHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  otpSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  mobileHighlight: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -10,
  },
  timerText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  demoHint: {
    color: COLORS.warning,
    fontSize: 12,
    fontStyle: 'italic',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 20,
  },
});