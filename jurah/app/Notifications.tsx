import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useContext, useEffect } from 'react';
import { ScheduleProvider } from './ScheduleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from './LanguageContext';
export async function SchedulePillNotification(pill) {


    await Notifications.cancelScheduledNotificationAsync(pill.id);

    const { language } = useContext(LanguageContext);

    const pillTime = new Date(pill.time_to_take);

    let triggerHour = pillTime.getHours();
    let triggerMinute = pillTime.getMinutes() - 10;

    if (triggerMinute < 0) {
        triggerMinute += 60;
        triggerHour = (triggerHour - 1 + 24) % 24;
    }


    await Notifications.scheduleNotificationAsync({
        identifier: pill.id,
        content: {
            title: language === "ar" ? "تذكير بالدواء!" : "Medication Reminder!",
            body: language === "ar" ? `أخذ ${pill.pillName} في 10 دقائق` : `Take your ${pill.pillName} pill in 10 minutes`,
        },
        trigger: {
            type: SchedulableTriggerInputTypes.DAILY,
            hour: triggerHour,
            minute: triggerMinute,
        },

    })
    console.log(await Notifications.getAllScheduledNotificationsAsync());
    console.log("notification set to " + triggerHour + ":" + triggerMinute);

}

export async function cancelScheduleNotification(pill) {
    await Notifications.cancelScheduledNotificationAsync(pill.id);
}