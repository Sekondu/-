import { createContext, useEffect, useReducer, useRef } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FileContext = createContext({ Filestate: [], FileDispatch: (action: any) => { } });

function FileReducer(state, action) {
    switch (action.type) {
        case 'add_file':
            return [...state, action.payload];

        case 'remove_file':
            // Delete actual file from device storage
            const fileToRemove = state.find(f => f.id === action.payload.id);
            if (fileToRemove) {
                FileSystem.deleteAsync(fileToRemove.localPath, { idempotent: true }).catch(() => { });
            }
            return state.filter(f => f.id !== action.payload.id);

        case 'load_files':
            return action.payload;

        default:
            return state;
    }
}

export default function FileProvider({ children }) {
    const [Filestate, FileDispatch] = useReducer(FileReducer, []);
    const hasLoaded = useRef(false);

    useEffect(() => {
        const loadFiles = async () => {
            const data = await AsyncStorage.getItem('historyFiles');
            if (data) {
                FileDispatch({ type: 'load_files', payload: JSON.parse(data) });
            }
            hasLoaded.current = true;
        };
        loadFiles();
    }, []);

    // Persist to AsyncStorage whenever Filestate changes (after initial load)
    useEffect(() => {
        if (!hasLoaded.current) return;
        AsyncStorage.setItem('historyFiles', JSON.stringify(Filestate));
    }, [Filestate]);

    return (
        <FileContext.Provider value={{ Filestate, FileDispatch }}>
            {children}
        </FileContext.Provider>
    );
}