import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useContext } from 'react';
import { ScheduleProvider } from './ScheduleContext';

export async function SchedulePillNotification(pill) {

    await Notifications.cancelScheduledNotificationAsync(pill.medicineId);

    const pillTime = new Date(pill.time_to_take);

    const now = new Date();
    const trigger = new Date(pillTime);
    trigger.setMinutes(trigger.getMinutes() - 10);
    if (trigger <= now) {
        trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
        identifier: pill.id,
        content: {
            title: "Medication Reminder!",
            body: `Take your ${pill.pillName} pill in 10 minutes`,
        },
        trigger: {
            type: SchedulableTriggerInputTypes.DATE,
            date: trigger,
        }
    })
    console.log("notification set to " + trigger.getHours() + " " + trigger.getMinutes());

}

export async function cancelScheduleNotification(pill) {
    await Notifications.cancelScheduledNotificationAsync(pill.id);
}