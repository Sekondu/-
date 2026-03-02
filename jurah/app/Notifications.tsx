import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export async function SchedulePillNotification(pill) {

    await Notifications.cancelScheduledNotificationAsync(pill.id);

    const pillTime = new Date(pill.time_to_take);

    await Notifications.scheduleNotificationAsync({
        identifier: pill.id,
        content: {
            title: "Medication Reminder!",
            body: `Take your ${pill.Name} pill in 10 minutes`,
        },
        trigger: {
            type: SchedulableTriggerInputTypes.CALENDAR,
            hour: pillTime.getMinutes() >= 10
                ? pillTime.getHours()
                : pillTime.getHours() === 0 ? 23 : pillTime.getHours() - 1,
            minute: pillTime.getMinutes() >= 10 ? pillTime.getMinutes() - 10 : pillTime.getMinutes() + 50,
            repeats: true,
        }
    })

}

export async function cancelScheduleNotification(pill) {
    await Notifications.cancelScheduledNotificationAsync(pill.id);
}