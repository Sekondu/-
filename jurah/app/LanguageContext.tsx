import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, NativeModules } from 'react-native';
import * as Updates from 'expo-updates';
import i18n from './i18n';

interface LanguageContextType {
    language: string;
    changeLanguage: (lang: string) => Promise<void>;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    changeLanguage: async () => { },
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<string>(i18n.locale);

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await AsyncStorage.getItem('appLanguage');
            if (savedLanguage) {
                i18n.locale = savedLanguage;
                setLanguage(savedLanguage);
            }
        };
        loadLanguage();
    }, []);

    const changeLanguage = async (newLanguage: string) => {
        await AsyncStorage.setItem('appLanguage', newLanguage);
        i18n.locale = newLanguage;
        setLanguage(newLanguage);

    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
