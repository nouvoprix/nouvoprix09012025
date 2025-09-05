import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en_language from '../translation/en.json';
import sp_language from '../translation/sp.json';
import fr_language from '../translation/fr.json';
import ha_language from '../translation/ha.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'English',
  fallbackLng: 'English',
  resources: {
    French: fr_language,
    Spanish: sp_language,
    English: en_language,
    HaitianCreole: ha_language,
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
