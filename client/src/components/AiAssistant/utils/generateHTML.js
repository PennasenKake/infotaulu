// client/src/components/AIAssistant/utils/generateHTML.js

export function generateBrandedHTML({ otsikko, sisalto, kehotus, template = 'perus' }) {
  const templates = {
    perus: require('../templates/perus').default,
    tumma: require('../templates/tumma').default,
    minimalistinen: require('../templates/minimalistinen').default,
  };

  const selectedTemplate = templates[template] || templates.perus;
  return selectedTemplate({ otsikko, sisalto, kehotus });
}