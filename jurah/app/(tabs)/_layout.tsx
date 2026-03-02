import { Platform, StyleSheet, I18nManager } from 'react-native';
import modal from '../Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Cabinet from '../Cabinet';
import { Ionicons } from '@expo/vector-icons';
import { PillProvider } from '../PillContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Add_medecine } from '../AddMedecine';
import { Update_medecine } from '../UpdateMedecine';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  })
})

function HomeScreen() {
  return (
    <Tab.Navigator >
      <Tab.Screen name="Cabinet" options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="medkit" size={size} color={color} />
        ),
        tabBarHideOnKeyboard: true
      }} component={Cabinet} />
      <Tab.Screen options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }} name="Home" component={modal} />
    </Tab.Navigator>
  );
}

export default function full_app() {

  useEffect(() => {
    Notifications.requestPermissionsAsync().then((res) => {
      if (res.status !== "granted") {
        alert("You need to allow notifications to use this app");
      }
    })
  }, [])
  return <SafeAreaProvider>
    <PillProvider>
      <StatusBar backgroundColor={"#FFF"} barStyle="dark-content" translucent={false} />
      <Stack.Navigator>
        <Stack.Screen name="Main Tabs" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="add_medecine" component={Add_medecine} options={{ presentation: "modal", headerShown: false, contentStyle: { backgroundColor: "lightgreen" } }} />
        <Stack.Screen name="update_medecine" component={Update_medecine} options={{ presentation: "modal", headerShown: false, contentStyle: { backgroundColor: "lightgreen" } }} />
      </Stack.Navigator>
    </PillProvider>
  </SafeAreaProvider>
}

