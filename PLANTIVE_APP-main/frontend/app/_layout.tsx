import { Stack } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';
import { COLORS } from '../constants/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        >
          {/* Index/Initial route - redirects to splash */}
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
            }}
          />
          
          {/* Auth group - CHANGED: Remove parentheses */}
          <Stack.Screen 
            name="auth" 
            options={{ 
              headerShown: false,
            }}
          />
          
          {/* Farmer group - CHANGED: Remove parentheses */}
          <Stack.Screen 
            name="farmer" 
            options={{ 
              headerShown: false,
            }}
          />
          
          {/* Official group - CHANGED: Remove parentheses */}
          <Stack.Screen 
            name="official" 
            options={{ 
              headerShown: false,
            }}
          />
          
          {/* Catch-all route for 404 */}
          <Stack.Screen 
            name="+not-found" 
            options={{ 
              headerShown: false,
            }}
          />
        </Stack>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}