import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../constants/colors';

export default function Index() {
  useEffect(() => {
    // Check if user is already logged in (in a real app)
    const checkAuth = async () => {
      // Simulate some loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, always redirect to splash screen
      // In a real app, check authentication token here
      router.replace('/auth/splash');
    };
    
    checkAuth();
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: COLORS.background 
    }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}