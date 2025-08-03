import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend'; // Import the backend

i18n
  .use(Backend) // Use the HTTP backend
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    backend: {
      loadPath: '/locales/{{lng}}.json', // Path to your translation files
    },
    lng: 'id', // default language set to Indonesian
    fallbackLng: 'id', // fallback language also set to Indonesian
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
    // debug: true, // Uncomment for debugging i18next
  });

export default i18n;