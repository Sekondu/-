import { useContext, useReducer, createContext, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SchedulePillNotification } from "./Notifications";
import * as Notifications from 'expo-notifications';
export const PillContext = createContext({ state: [], dispatch: () => { } });

function Pillreducer(state, action) {

    switch (action.type) {

        case 'add_medecine':
            return [...state, action.payload];

        case 'remove_medecine':
            return state.filter(medecine => medecine.id !== action.payload.id);

        case 'update_medecine':
            return [...state.filter(medecine => medecine.id !== action.payload.id), action.payload];

        case 'load_pills':
            return action.payload.map(pill => ({
                ...pill, time_to_take: new Date(pill.time_to_take),
            }));

        default:
            return state;
    }

}



export function PillProvider({ children }) {

    const [state, dispatch] = useReducer(Pillreducer, []);

    const hasLoaded = useRef(false);

    useEffect(() => {
        const loadPills = async () => {
            const pills = await AsyncStorage.getItem("pills");
            if (pills) {
                dispatch({ type: "load_pills", payload: JSON.parse(pills) });
            }
            hasLoaded.current = true;
        };
        loadPills();
    }, []);

    useEffect(() => {
        if (!hasLoaded.current) return;
        AsyncStorage.setItem("pills", JSON.stringify(state));
    }, [state]);



    return <PillContext.Provider value={{ state, dispatch }} >
        {children}
    </PillContext.Provider>
}