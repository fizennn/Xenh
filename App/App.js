import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import StyleSuggestScreen from './screens/StyleSuggestScreen';
import ExploreScreen from './screens/ExploreScreen';
import { AppProvider } from './context/AppContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // Bọc toàn bộ app với AppProvider để quản lý state toàn cục
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') iconName = 'home-outline';
              else if (route.name === 'Upload') iconName = 'cloud-upload-outline';
              else if (route.name === 'StyleSuggest') iconName = 'bulb-outline';
              else if (route.name === 'Explore') iconName = 'compass-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1976d2',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Upload" component={UploadScreen} />
          <Tab.Screen name="StyleSuggest" component={StyleSuggestScreen} options={{ title: 'Gợi ý phối đồ' }} />
          <Tab.Screen name="Explore" component={ExploreScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
} 