import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import StyleSuggestScreen from './screens/StyleSuggestScreen';
import ExploreScreen from './screens/ExploreScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { AppProvider } from './context/AppContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from './screens/ProfileScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import SavedPostsScreen from './screens/SavedPostsScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import EditPostScreen from './screens/EditPostScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Upload') iconName = 'cloud-upload-outline';
          else if (route.name === 'Explore') iconName = 'compass-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home">
        {props => <HomeScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} onLogout={() => onLogout()} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  // State giả lập đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Truyền props navigation cho Login/Register để chuyển trạng thái đăng nhập
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="MainTabs">
                {props => <MainTabs {...props} onLogout={() => setIsLoggedIn(false)} />}
              </Stack.Screen>
              <Stack.Screen name="PostDetail" component={PostDetailScreen} />
              <Stack.Screen name="UserProfile" component={UserProfileScreen} />
              <Stack.Screen name="SavedPosts" component={SavedPostsScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen name="EditPostScreen" component={EditPostScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login">
                {props => <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {props => <RegisterScreen {...props} onRegister={() => setIsLoggedIn(true)} />}
              </Stack.Screen>
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
} 