import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import idTranslation from './locales/id.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      id: {
        translation: idTranslation,
      },
    },
    lng: 'id', // default language set to Indonesian
    fallbackLng: 'id', // fallback language also set to Indonesian
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
  });

export default i18n;