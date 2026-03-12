import { createContext, useReducer, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SchedulePillNotification } from "./Notifications";
import * as Notifications from 'expo-notifications';
import { cancelScheduleNotification } from "./Notifications";

export const ScheduleContext = createContext({ Schedulestate: [], Scheduledispatch: () => { } });


function ScheduleReducer(state, action) {



    switch (action.type) {
        case 'add_schedule':
            const alreadyScheduled = state.some(s => (
                s.pillName === action.payload.pillName && s.time_to_take.getHours() === action.payload.time_to_take.getHours() &&
                s.time_to_take.getMinutes() === action.payload.time_to_take.getMinutes()
            ))
            if (alreadyScheduled) {
                return state;
            }
            return [...state, action.payload];
        case 'remove_schedule':
            return state.filter(s => s.id !== action.payload.id);
        case 'update_schedule':
            return [...state.filter(s => s.id !== action.payload.id), action.payload];
        case 'load_schedules':
            return action.payload.map(pill => ({
                ...pill, time_to_take: new Date(pill.time_to_take)
            }));
        default:
            return state;
    }
}

export function ScheduleProvider({ children }) {

    const [Schedulestate, Scheduledispatch] = useReducer(ScheduleReducer, []);

    const hasLoaded = useRef(false);

    useEffect(() => {
        const version_schedules = async () => {
            const hasRun = await AsyncStorage.getItem("v_1.1");
            if (!hasRun) {
                await Notifications.cancelAllScheduledNotificationsAsync();
                AsyncStorage.setItem("v_1.1", "1.1");
            }
            const schedules = await AsyncStorage.getItem("schedules");
            if (schedules) {
                const parsedSchedules = JSON.parse(schedules);
                Scheduledispatch({ type: "load_schedules", payload: parsedSchedules });


                // 2. Loop through the loaded schedules and rebuild notifications cleanly
                const savedLanguage = await AsyncStorage.getItem('appLanguage') || 'en';
                parsedSchedules.forEach((schedule: any) => {
                    // Need to convert the string back to a Date object first just like the reducer does
                    const rebuiltSchedule = { ...schedule, time_to_take: new Date(schedule.time_to_take) };
                    SchedulePillNotification(rebuiltSchedule, savedLanguage);
                });
            }
            hasLoaded.current = true;
        }
        version_schedules();
    }, [])





    useEffect(() => {
        if (!hasLoaded.current) return;
        AsyncStorage.setItem("schedules", JSON.stringify(Schedulestate));
    }, [Schedulestate])

    return <ScheduleContext.Provider value={{ Schedulestate, Scheduledispatch }}>
        {children}
    </ScheduleContext.Provider>

}