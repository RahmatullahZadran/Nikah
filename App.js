import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Screens
import LoginScreen from './component/Login/LoginScreen';
import SignUpScreen from './component/Signup/SignUpScreen';
import ProfileScreen from './component/ProfileScreen/ProfileScreen';
import FatherLoginScreen from './component/Login/FatherLoginScreen';
import EditProfileScreen from './component/ProfileScreen/EditProfileScreen';
import EditAboutScreen from './component/ProfileScreen/EditAboutScreen';
import EditPreferencesScreen from './component/ProfileScreen/EditPreferencesScreen';

// Placeholder Tab Screens
function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search Screen</Text>
    </View>
  );
}

function MessagesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Messages Screen</Text>
    </View>
  );
}

function LikedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Liked Screen</Text>
    </View>
  );
}

// Tab Navigator
const Tab = createBottomTabNavigator();
function MainTabs({ route }) {
  const { userId } = route.params; // Get userId from params

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Liked') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Disable header for tabs
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Liked" component={LikedScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userId }} // Pass the userId as a parameter
      />
    </Tab.Navigator>
  );
}

// Stack Navigator
const Stack = createStackNavigator();

// Custom Theme for PaperProvider
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: '#f1c40f',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="FatherLogin" component={FatherLoginScreen} />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            initialParams={{ userId: 'sampleUserId' }} // Placeholder userId (replace with actual logic)
          />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="EditAboutScreen" component={EditAboutScreen} />
          <Stack.Screen name="EditPreferences" component={EditPreferencesScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
