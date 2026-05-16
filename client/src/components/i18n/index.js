

// $ npm install i18next --save

// $ npm install i18next-browser-languagedetector --save

// IMPORTTAA TARVITTAVAT PAKETIT MUIHIN TIEDOSTOIHIN

// VERHOA KAIKKI NÄKYVÄT TEKSTIT VASTAAMAAN JSON TEKSTEJÄ

// LISÄÄ KIELENVAIHTO PAINIKE HEADERIIN JA TARKISTA CSS TYYLIT

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fiTranslation from './locales/fi/translation.json';
import enTranslation from './locales/en/translation.json';

const resources = {
  fi: { translation: fiTranslation },
  en: { translation: enTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fi',
    supportedLngs: ['fi', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;


// ESIMERKKI HEADERISTÄ

// import React from "react";
// import "./header.css";
// import LanguageSwitcher from './i18n/LanguageSwitcher';
// import { useTranslation } from 'react-i18next';

// function Header() {
//   const { t } = useTranslation();

//   return (
//     <header className="header">
//       <h1>{t('header.title')}</h1>
//       <p>{t('header.subtitle')}</p>
//       <div className="header-right">
//         <LanguageSwitcher />
//       </div>
//     </header>
//   );
// }

// export default Header;
