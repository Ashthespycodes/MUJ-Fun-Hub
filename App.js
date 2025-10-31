import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import StudySpotsScreen from './screens/StudySpotsScreen';
import EatingSpotsScreen from './screens/EatingSpotsScreen';
import ConfessionsScreen from './screens/ConfessionsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddSpotScreen from './screens/AddSpotScreen';
import SpotDetailsScreen from './screens/SpotDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Study Spots') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Eating Spots') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Confessions') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Study Spots" component={StudySpotsScreen} />
      <Tab.Screen name="Eating Spots" component={EatingSpotsScreen} />
      <Tab.Screen name="Confessions" component={ConfessionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AddSpot" 
          component={AddSpotScreen} 
          options={({ route }) => ({ 
            title: `Add ${route.params.spotType}`,
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
          })} 
        />
        <Stack.Screen 
          name="SpotDetails" 
          component={SpotDetailsScreen} 
          options={({ route }) => ({ 
            title: route.params.spot.name,
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}