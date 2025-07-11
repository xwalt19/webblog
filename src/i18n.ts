import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en.json';
import idTranslation from './locales/id.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      id: {
        translation: idTranslation,
      },
    },
    lng: 'id', // default language
    fallbackLng: 'en', // fallback language if translation is missing
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
  });

export default i18n;