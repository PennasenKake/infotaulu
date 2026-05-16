import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div style={{ marginBottom: '15px' }}>
      <button 
        onClick={() => i18n.changeLanguage('fi')}
        style={{ 
          fontWeight: i18n.language === 'fi' ? 'bold' : 'normal',
          marginRight: '10px'
        }}
      >
        🇫🇮 Suomi
      </button>
      <button 
        onClick={() => i18n.changeLanguage('en')}
        style={{ fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}
      >
        🇬🇧 English
      </button>
    </div>
  );
};
