import { Stack } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { useLanguage } from '../../hooks/useLanguage';

export default function AuthLayout() {
  const { t } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      {/* Splash Screen - No Header */}
      <Stack.Screen
        name="splash"
        options={{
          headerShown: false,
        }}
      />
      
      {/* Language Selection */}
      <Stack.Screen
        name="language"
        options={{
          title: 'Select Language',
          headerBackTitle: 'Back',
        }}
      />
      
      {/* Role Selection */}
      <Stack.Screen
        name="role"
        options={{
          title: 'Select Your Role',
          headerBackTitle: 'Back',
        }}
      />
      
      {/* Farmer Login */}
      <Stack.Screen
        name="farmer/login"
        options={{
          title: 'Farmer Login',
          headerBackTitle: 'Back',
        }}
      />
      
      {/* Farmer Registration */}
      <Stack.Screen
        name="farmer/register"
        options={{
          title: 'Farmer Registration',
          headerBackTitle: 'Back',
        }}
      />
      
      {/* Official Login */}
      <Stack.Screen
        name="official/login"
        options={{
          title: 'Official Login',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}