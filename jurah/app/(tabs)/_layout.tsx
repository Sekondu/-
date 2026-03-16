import { Platform, StyleSheet, I18nManager, Text, TextInput, StatusBar } from 'react-native';

// Disable font scaling globally to prevent Android UI layout breaks
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;

import modal from '../Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { SchedulePillNotification } from '../Notifications';
import { useFonts, RobotoSlab_400Regular, RobotoSlab_700Bold } from '@expo-google-fonts/roboto-slab';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { NotoSerif_400Regular, NotoSerif_700Bold } from '@expo-google-fonts/noto-serif';
import { ZillaSlab_400Regular, ZillaSlab_700Bold } from '@expo-google-fonts/zilla-slab';
import { ScheduleProvider } from '../ScheduleContext';
import { LanguageProvider } from '../LanguageContext';
import { Add_schedule } from '../AddSchedule';
import { Update_schedule } from '../UpdateSchedule';
import FileProvider from '../FileContext';
import Settings from '../Settings';
import { History } from '../History';

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
      <Tab.Screen options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="file-tray-full" size={size} color={color} />
        ),
      }} name="History" component={History} />
      <Tab.Screen options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" size={size} color={color} />
        ),
      }} name="settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default function full_app() {

  const [fontsLoaded] = useFonts({
    RobotoSlab_400Regular,
    RobotoSlab_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
    NotoSerif_400Regular: require("../../node_modules/@expo-google-fonts/noto-serif/400Regular/NotoSerif_400Regular.ttf"),
    NotoSerif_700Bold: require("../../node_modules/@expo-google-fonts/noto-serif/700Bold/NotoSerif_700Bold.ttf"),
    ZillaSlab_400Regular,
    ZillaSlab_700Bold,
  })

  useEffect(() => {
    Notifications.requestPermissionsAsync().then((res) => {
      if (res.status !== "granted") {
        alert("You need to allow notifications to use this app");
      }
    })
  }, [])

  if (!fontsLoaded) return null;


  return <SafeAreaProvider>
    <StatusBar barStyle={"dark-content"} backgroundColor={"#F9F9F9"} />
    <LanguageProvider>
      <FileProvider>
        <ScheduleProvider>
          <PillProvider>
            <Stack.Navigator>
              <Stack.Screen name="Main Tabs" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="add_medecine" component={Add_medecine} options={{ presentation: "modal", headerShown: false, contentStyle: { backgroundColor: "#F9F9F9" } }} />
              <Stack.Screen name="update_medecine" component={Update_medecine} options={{ presentation: "modal", headerShown: false, contentStyle: { backgroundColor: "#F9F9F9" } }} />
              <Stack.Screen name="add_schedule" component={Add_schedule} options={{ presentation: "modal", headerShown: false, contentStyle: { backgroundColor: "#F9F9F9" } }} />
              <Stack.Screen name="update_schedule" component={Update_schedule} options={{ presentation: "modal", headerShown: false, contentStyle: { backgroundColor: "#F9F9F9" } }} />
            </Stack.Navigator>
          </PillProvider>
        </ScheduleProvider>
      </FileProvider>
    </LanguageProvider>
  </SafeAreaProvider>
}

