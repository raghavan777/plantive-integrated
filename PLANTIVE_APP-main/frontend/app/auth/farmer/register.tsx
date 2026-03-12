// /home/ashith/Plantive/app/auth/farmer/register.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '../../../constants/api';

// Import your constants
import { INDIAN_STATES } from '../../../constants/states-districts';
import { FARMER_TYPES, FARMER_CATEGORIES } from '../../../constants/languages';

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
  info: '#2196f3',
};

const { width, height } = Dimensions.get('window');

// Type for interval reference
type IntervalRef = ReturnType<typeof setInterval> | null;

// Steps for registration
const STEPS = [
  { label: 'Phone Verification', icon: 'phone-portrait' },
  { label: 'OTP Verification', icon: 'lock-closed' },
  { label: 'PMFBY Validation', icon: 'card' },
  { label: 'Complete', icon: 'checkmark-circle' },
];

// InputField Component
const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  important = false,
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  editable = true,
  error,
  icon,
  iconColor = COLORS.gray,
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>
      {label}
      {important && <Text style={styles.important}> *</Text>}
    </Text>
    <View style={[styles.inputWrapper, error && styles.inputError]}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={iconColor} 
          style={styles.inputIcon} 
        />
      )}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          !editable && styles.disabledInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// Step Indicator Component
const StepIndicator = ({ steps, activeStep }: any) => (
  <View style={styles.stepIndicator}>
    {steps.map((step: any, index: number) => (
      <React.Fragment key={step.label}>
        <View style={styles.stepItem}>
          <View style={[
            styles.stepIcon,
            index === activeStep && styles.stepIconActive,
            index < activeStep && styles.stepIconCompleted,
          ]}>
            {index < activeStep ? (
              <Ionicons name="checkmark" size={16} color={COLORS.white} />
            ) : (
              <Ionicons name={step.icon} size={16} color={
                index === activeStep ? COLORS.white : 
                index < activeStep ? COLORS.white : COLORS.gray
              } />
            )}
          </View>
          <Text style={[
            styles.stepLabel,
            index === activeStep && styles.stepLabelActive,
            index < activeStep && styles.stepLabelCompleted,
          ]}>
            {step.label}
          </Text>
        </View>
        {index < steps.length - 1 && (
          <View style={[
            styles.stepConnector,
            index < activeStep && styles.stepConnectorActive,
          ]} />
        )}
      </React.Fragment>
    ))}
  </View>
);

// OTP Input Component - SIMPLE VERSION WITHOUT REF ISSUES
const OtpInput = ({ otp, setOtp, loading }: any) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;
    
    const newOtp = otp.split('');
    newOtp[index] = text;
    const updatedOtp = newOtp.join('').slice(0, 6);
    
    setOtp(updatedOtp);
    
    // Auto-focus next input
    if (text && index < 5) {
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to focus previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      setFocusedIndex(index - 1);
    }
  };

  return (
    <View style={styles.otpContainerWrapper}>
      <Text style={styles.otpLabel}>Enter 6-digit OTP</Text>
      <View style={styles.otpInputsContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <TextInput
            key={index}
            style={[
              styles.otpInput,
              otp[index] && styles.otpInputFilled,
              focusedIndex === index && styles.otpInputFocused,
            ]}
            value={otp[index] || ''}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            editable={!loading}
            selectTextOnFocus={true}
            autoFocus={focusedIndex === index}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
          />
        ))}
      </View>
    </View>
  );
};

export default function FarmerRegister() {
  const router = useRouter();
  
  // Step management
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // OTP states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  
  // PMFBY states
  const [pmfbyId, setPmfbyId] = useState('');
  const [pmfbyValid, setPmfbyValid] = useState(false);
  const [showPmfbyDialog, setShowPmfbyDialog] = useState(false);
  
  // Farmer details
  const [farmerName, setFarmerName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [landArea, setLandArea] = useState('');
  const [crops, setCrops] = useState('');
  
  // Timer ref
  const intervalRef = useRef<IntervalRef>(null);

  // Timer effect
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

  // Validate phone number
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SEND_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: phoneNumber,
          isRegister: true 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      setActiveStep(1);
      setOtpSent(true);
      setOtpTimer(60);
      setSuccess('OTP sent successfully. Check backend terminal.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: phoneNumber,
          otp: otp 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      
      setOtpVerified(true);
      setActiveStep(2);
      setSuccess('Phone number verified successfully!');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  // Validate PMFBY ID
  const handleValidatePmfbyId = async () => {
    if (!pmfbyId.trim()) {
      setError('PMFBY ID is required');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Validate format
    const pmfbyRegex = /^PMFBY\d{10}$/i;
    if (!pmfbyRegex.test(pmfbyId.trim())) {
      setError('Invalid PMFBY ID format. Expected: PMFBY followed by 10 digits');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call to validate PMFBY ID
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept specific IDs
      const validIds = ['PMFBY2024000001', 'PMFBY2024000002', 'PMFBY2024000003'];
      
      if (validIds.includes(pmfbyId.toUpperCase())) {
        setPmfbyValid(true);
        
        // Mock farmer data based on PMFBY ID
        const mockData = {
          farmerName: pmfbyId.toUpperCase() === 'PMFBY2024000001' ? 'Rajesh Kumar' : 
                     pmfbyId.toUpperCase() === 'PMFBY2024000002' ? 'Priya Singh' : 'Amit Sharma',
          fatherName: pmfbyId.toUpperCase() === 'PMFBY2024000001' ? 'Suresh Kumar' : 
                     pmfbyId.toUpperCase() === 'PMFBY2024000002' ? 'Rajendra Singh' : 'Vikram Sharma',
          state: 'Madhya Pradesh',
          district: pmfbyId.toUpperCase() === 'PMFBY2024000001' ? 'Bhopal' : 
                   pmfbyId.toUpperCase() === 'PMFBY2024000002' ? 'Indore' : 'Jabalpur',
          village: pmfbyId.toUpperCase() === 'PMFBY2024000001' ? 'Bairagarh' : 
                  pmfbyId.toUpperCase() === 'PMFBY2024000002' ? 'Rau' : 'Adhartal',
          landArea: '5.2',
          crops: pmfbyId.toUpperCase() === 'PMFBY2024000001' ? 'Wheat, Soybean' : 
                pmfbyId.toUpperCase() === 'PMFBY2024000002' ? 'Rice, Maize' : 'Cotton, Wheat',
        };
        
        setFarmerName(mockData.farmerName);
        setFatherName(mockData.fatherName);
        setState(mockData.state);
        setDistrict(mockData.district);
        setVillage(mockData.village);
        setLandArea(mockData.landArea);
        setCrops(mockData.crops);
        
        setSuccess('PMFBY ID validated successfully!');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setShowPmfbyDialog(true);
        setError('PMFBY ID not found in government records');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err: any) {
      setError('Validation failed. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  // Complete registration
  const handleCompleteRegistration = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setActiveStep(3);
      setSuccess('Registration completed successfully!');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.replace('/farmer/home');
      }, 3000);
    } catch (err: any) {
      setError('Registration failed. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendAttempts >= 3) {
      setError('Maximum resend attempts reached. Please try again later.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    setResendAttempts(prev => prev + 1);
    setOtpTimer(0);
    setOtp('');
    await handleSendOtp();
  };

  // Open PMFBY website
  const openPmfbyWebsite = async () => {
    try {
      const url = 'https://pmfby.gov.in/';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
        setShowPmfbyDialog(false);
        Alert.alert(
          'PMFBY Registration',
          'Please register on PMFBY website and obtain your Farmer ID. Return to this app after getting your ID.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Cannot open PMFBY website');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open PMFBY website');
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Phone Input
        return (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <Ionicons name="phone-portrait" size={24} color={COLORS.primary} />
              <Text style={styles.stepTitle}>Enter Mobile Number</Text>
            </View>
            <Text style={styles.stepSubtitle}>
              We'll send a 6-digit OTP for verification
            </Text>
            
            <InputField
              label="Mobile Number"
              value={phoneNumber}
              onChangeText={(text: string) => setPhoneNumber(text.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              important={true}
              icon="call-outline"
              iconColor={COLORS.primary}
              error={error && error.includes('mobile') ? error : ''}
            />
            
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!validatePhoneNumber(phoneNumber) || loading) && styles.buttonDisabled,
              ]}
              onPress={handleSendOtp}
              disabled={loading || !validatePhoneNumber(phoneNumber)}
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
          </View>
        );

      case 1: // OTP Verification
        return (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
              <Text style={styles.stepTitle}>Verify OTP</Text>
            </View>
            <Text style={styles.stepSubtitle}>
              Enter OTP sent to {formatPhoneNumber(phoneNumber)}
            </Text>
            
            <OtpInput otp={otp} setOtp={setOtp} loading={loading} />
            
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (otp.length !== 6 || loading) && styles.buttonDisabled,
              ]}
              onPress={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
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
            
            <View style={styles.timerContainer}>
              {otpTimer > 0 ? (
                <Text style={styles.timerText}>
                  Resend OTP in {otpTimer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text style={styles.resendText}>
                    {resendAttempts >= 3 ? 'Max attempts reached' : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setActiveStep(0);
                setOtp('');
                setOtpSent(false);
                setOtpTimer(60);
              }}
            >
              <Ionicons name="arrow-back-outline" size={18} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>Change Phone Number</Text>
            </TouchableOpacity>
          </View>
        );

      case 2: // PMFBY Validation
        return (
          <>
            <View style={styles.infoAlert}>
              <Ionicons name="information-circle" size={20} color={COLORS.info} />
              <Text style={styles.infoAlertText}>
                <Text style={{ fontWeight: 'bold' }}>PMFBY ID is Mandatory</Text>
                {'\n'}Your Pradhan Mantri Fasal Bima Yojana ID is required to verify your farmer status.
              </Text>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Ionicons name="card" size={24} color={COLORS.primary} />
                <Text style={styles.stepTitle}>Enter PMFBY ID</Text>
              </View>
              <Text style={styles.stepSubtitle}>
                Phone verified: {formatPhoneNumber(phoneNumber)}
              </Text>
              
              <InputField
                label="PMFBY ID"
                value={pmfbyId}
                onChangeText={(text: string) => setPmfbyId(text.toUpperCase())}
                placeholder="Enter PMFBY ID (e.g., PMFBY2024000001)"
                important={true}
                icon="document-text-outline"
                iconColor={COLORS.primary}
                error={error}
                editable={!pmfbyValid}
              />
              
              {!pmfbyValid ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      (!pmfbyId.trim() || loading) && styles.buttonDisabled,
                    ]}
                    onPress={handleValidatePmfbyId}
                    disabled={loading || !pmfbyId.trim()}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.secondary]}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {loading ? (
                        <Text style={styles.buttonText}>Validating...</Text>
                      ) : (
                        <>
                          <Text style={styles.buttonText}>Validate PMFBY ID</Text>
                          <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <View style={styles.pmfbyHelpContainer}>
                    <Text style={styles.pmfbyHelpText}>
                      Don't have a PMFBY ID?
                    </Text>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => setShowPmfbyDialog(true)}
                    >
                      <Ionicons name="open-outline" size={18} color={COLORS.primary} />
                      <Text style={styles.secondaryButtonText}>Register on PMFBY Portal</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.successAlert}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                    <Text style={styles.successAlertText}>
                      PMFBY ID validated successfully!
                    </Text>
                  </View>
                  
                  <Text style={styles.sectionTitle}>Farmer Details</Text>
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Farmer Name</Text>
                      <Text style={styles.detailValue}>{farmerName}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Father's Name</Text>
                      <Text style={styles.detailValue}>{fatherName}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>State</Text>
                      <Text style={styles.detailValue}>{state}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>District</Text>
                      <Text style={styles.detailValue}>{district}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Village</Text>
                      <Text style={styles.detailValue}>{village}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Land Area</Text>
                      <Text style={styles.detailValue}>{landArea} hectares</Text>
                    </View>
                    <View style={[styles.detailItem, { width: '100%' }]}>
                      <Text style={styles.detailLabel}>Crops Grown</Text>
                      <Text style={styles.detailValue}>{crops}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleCompleteRegistration}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.secondary]}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {loading ? (
                        <Text style={styles.buttonText}>Processing...</Text>
                      ) : (
                        <>
                          <Text style={styles.buttonText}>Complete Registration</Text>
                          <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={styles.buttonIcon} />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { marginTop: 10 }]}
              onPress={() => setActiveStep(1)}
            >
              <Ionicons name="arrow-back-outline" size={18} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          </>
        );

      case 3: // Registration Complete
        return (
          <View style={styles.stepCard}>
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={80} color={COLORS.primary} />
              </View>
              
              <Text style={styles.successTitle}>Registration Successful!</Text>
              
              <Text style={styles.successMessage}>
                Welcome to Plantive, {'\n'}
                <Text style={{ fontWeight: 'bold' }}>{farmerName}</Text>!
              </Text>
              
              <View style={styles.successDetails}>
                <View style={styles.successDetailRow}>
                  <Text style={styles.successDetailLabel}>Phone:</Text>
                  <Text style={styles.successDetailValue}>{formatPhoneNumber(phoneNumber)}</Text>
                </View>
                <View style={styles.successDetailRow}>
                  <Text style={styles.successDetailLabel}>PMFBY ID:</Text>
                  <Text style={styles.successDetailValue}>{pmfbyId}</Text>
                </View>
                <View style={styles.successDetailRow}>
                  <Text style={styles.successDetailLabel}>Location:</Text>
                  <Text style={styles.successDetailValue}>{village}, {district}, {state}</Text>
                </View>
              </View>
              
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Redirecting to your dashboard...</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
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
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => {
                if (activeStep > 0) {
                  setActiveStep(activeStep - 1);
                } else {
                  router.back();
                }
              }}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.content} />
            </TouchableOpacity>
            <Text style={styles.title}>Farmer Registration</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Step Indicator */}
          <StepIndicator steps={STEPS} activeStep={activeStep} />

          {/* Error Alert */}
          {error && (
            <View style={styles.errorAlert}>
              <Ionicons name="alert-circle" size={20} color={COLORS.error} />
              <Text style={styles.errorAlertText}>{error}</Text>
            </View>
          )}

          {/* Success Alert */}
          {success && (
            <View style={styles.successAlert}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              <Text style={styles.successAlertText}>{success}</Text>
            </View>
          )}

          {/* Step Content */}
          <View style={styles.formContainer}>
            {renderStepContent()}
          </View>

          {/* Login Link */}
          {activeStep < 3 && (
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/auth/farmer/login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>

      {/* PMFBY Dialog */}
      <Modal
        visible={showPmfbyDialog}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPmfbyDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <MaterialIcons name="warning" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>PMFBY ID Required</Text>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                To register as a farmer, a valid <Text style={{ fontWeight: 'bold' }}>PMFBY ID</Text> is mandatory.
              </Text>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxTitle}>What is PMFBY?</Text>
                <Text style={styles.infoBoxText}>
                  Pradhan Mantri Fasal Bima Yojana (PMFBY) is a government crop insurance scheme that provides comprehensive risk coverage against crop loss.
                </Text>
              </View>
              
              <View style={styles.stepsContainer}>
                <Text style={styles.stepsTitle}>Steps to get PMFBY ID:</Text>
                <View style={styles.stepItemModal}>
                  <Text style={styles.stepNumber}>1</Text>
                  <Text style={styles.stepText}>Visit the official PMFBY portal</Text>
                </View>
                <View style={styles.stepItemModal}>
                  <Text style={styles.stepNumber}>2</Text>
                  <Text style={styles.stepText}>Register as a farmer with your details</Text>
                </View>
                <View style={styles.stepItemModal}>
                  <Text style={styles.stepNumber}>3</Text>
                  <Text style={styles.stepText}>Submit required documents</Text>
                </View>
                <View style={styles.stepItemModal}>
                  <Text style={styles.stepNumber}>4</Text>
                  <Text style={styles.stepText}>Receive your PMFBY ID</Text>
                </View>
                <View style={styles.stepItemModal}>
                  <Text style={styles.stepNumber}>5</Text>
                  <Text style={styles.stepText}>Return here to complete registration</Text>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowPmfbyDialog(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={openPmfbyWebsite}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.modalButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalButtonTextPrimary}>Go to PMFBY Portal</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  stepItem: {
    alignItems: 'center',
    position: 'relative',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconActive: {
    backgroundColor: COLORS.primary,
  },
  stepIconCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 5,
    textAlign: 'center',
    width: 80,
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  stepConnector: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 5,
  },
  stepConnectorActive: {
    backgroundColor: COLORS.primary,
  },
  formContainer: {
    padding: 20,
  },
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginLeft: 10,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.content,
    marginBottom: 8,
  },
  important: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faf8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.content,
    paddingVertical: 0,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    color: COLORS.gray,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 10,
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
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  otpContainerWrapper: {
    marginBottom: 20,
  },
  otpLabel: {
    fontSize: 14,
    color: COLORS.content,
    marginBottom: 10,
    textAlign: 'center',
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f8faf8',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: '#e8f5e9',
  },
  otpInputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: '#e8f5e9',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 15,
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
  infoAlert: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoAlertText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 20,
  },
  errorAlert: {
    flexDirection: 'row',
    backgroundColor: '#ffeaea',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorAlertText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 20,
  },
  successAlert: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  successAlertText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.content,
    fontWeight: '500',
    lineHeight: 20,
  },
  pmfbyHelpContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  pmfbyHelpText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    width: '48%',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.content,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  successDetails: {
    width: '100%',
    backgroundColor: '#f8faf8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  successDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  successDetailLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  successDetailValue: {
    fontSize: 14,
    color: COLORS.content,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 10,
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  loginText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  loginTextBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faf8',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.content,
    marginBottom: 20,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  infoBoxText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  stepsContainer: {
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  stepItemModal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonSecondary: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 10,
  },
  modalButtonPrimary: {
    marginLeft: 10,
  },
  modalButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonTextSecondary: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 50,
  },
  modalButtonTextPrimary: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});