import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native';
import { COLORS } from './constants/colors';

// Import screens
import SplashScreen from './app/auth/splash';
import LanguageScreen from './app/auth/language';
import RoleSelectionScreen from './app/auth/role';
import FarmerLoginScreen from './app/auth/farmer/login';
import FarmerRegisterScreen from './app/auth/farmer/register';
import OfficialLoginScreen from './app/auth/official/login';

// Farmer screens
import FarmerHomeScreen from './app/farmer/home';
import FarmerStatusScreen from './app/farmer/status';
import FarmerHistoryScreen from './app/farmer/history';
import FarmerProfileScreen from './app/farmer/profile';
import CaptureScreen from './app/farmer/capture';

// Official screens
import OfficialHomeScreen from './app/official/home';
import AssignmentsScreen from './app/official/assignments';
import FarmDetailsScreen from './app/official/farm-details';
import VerificationScreen from './app/official/verification/index';
import GPSCheckScreen from './app/official/verification/gps';
import OfficialHistoryScreen from './app/official/history';
import OfficialProfileScreen from './app/official/profile';

const Stack = createNativeStackNavigator();
const FarmerTab = createBottomTabNavigator();
const OfficialTab = createBottomTabNavigator();

// Farmer Bottom Tab Navigator
function FarmerTabNavigator() {
  return (
    <FarmerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <FarmerTab.Screen 
        name="Home" 
        component={FarmerHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
          title: 'Farmer Dashboard',
        }}
      />
      <FarmerTab.Screen 
        name="Capture" 
        component={CaptureScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📸</Text>
          ),
          title: 'Capture Crop',
        }}
      />
      <FarmerTab.Screen 
        name="Status" 
        component={FarmerStatusScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📊</Text>
          ),
          title: 'Claim Status',
        }}
      />
      <FarmerTab.Screen 
        name="History" 
        component={FarmerHistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📋</Text>
          ),
          title: 'History',
        }}
      />
    </FarmerTab.Navigator>
  );
}

// Official Bottom Tab Navigator
function OfficialTabNavigator() {
  return (
    <OfficialTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <OfficialTab.Screen 
        name="OfficialHome" 
        component={OfficialHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
          title: 'Officer Dashboard',
        }}
      />
      <OfficialTab.Screen 
        name="Assignments" 
        component={AssignmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📋</Text>
          ),
          title: 'Assigned Farms',
        }}
      />
      <OfficialTab.Screen 
        name="History" 
        component={OfficialHistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📊</Text>
          ),
          title: 'Visit History',
        }}
      />
      <OfficialTab.Screen 
        name="Profile" 
        component={OfficialProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
          title: 'Profile',
        }}
      />
    </OfficialTab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            initialRouteName="Splash"
            screenOptions={{
              headerStyle: {
                backgroundColor: COLORS.primary,
              },
              headerTintColor: COLORS.white,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {/* Auth Stack */}
            <Stack.Screen 
              name="Splash" 
              component={SplashScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Language" 
              component={LanguageScreen}
              options={{ title: 'Select Language' }}
            />
            <Stack.Screen 
              name="Role" 
              component={RoleSelectionScreen}
              options={{ title: 'Select Role' }}
            />
            <Stack.Screen 
              name="FarmerLogin" 
              component={FarmerLoginScreen}
              options={{ title: 'Farmer Login' }}
            />
            <Stack.Screen 
              name="FarmerRegister" 
              component={FarmerRegisterScreen}
              options={{ title: 'Farmer Registration' }}
            />
            <Stack.Screen 
              name="OfficialLogin" 
              component={OfficialLoginScreen}
              options={{ title: 'Official Login' }}
            />

            {/* Farmer Main Stack */}
            <Stack.Screen 
              name="FarmerMain" 
              component={FarmerTabNavigator}
              options={{ headerShown: false }}
            />

            {/* Official Main Stack */}
            <Stack.Screen 
              name="OfficialMain" 
              component={OfficialTabNavigator}
              options={{ headerShown: false }}
            />

            {/* Official Detail Screens */}
            <Stack.Screen 
              name="FarmDetails" 
              component={FarmDetailsScreen}
              options={{ title: 'Farm Details' }}
            />
            <Stack.Screen 
              name="Verification" 
              component={VerificationScreen}
              options={{ title: 'Verification Process' }}
            />
            <Stack.Screen 
              name="GPSCheck" 
              component={GPSCheckScreen}
              options={{ title: 'GPS Verification' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}