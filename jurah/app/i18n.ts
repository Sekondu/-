import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './locales/en.json';
import ar from './locales/ar.json';

// Bind translations to i18n instance
const i18n = new I18n({
    en,
    ar,
});

// Set default fallback language
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Set current locale to device's default locale at startup
const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
i18n.locale = deviceLanguage;

export default i18n;
