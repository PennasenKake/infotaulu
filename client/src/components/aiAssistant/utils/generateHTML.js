// client/src/components/AIAssistant/utils/generateHTML.js
import perusTemplate from '../templates/perus';
import tummaTemplate from '../templates/tumma';
import minimalistinenTemplate from '../templates/minimalistinen';

export function generateBrandedHTML({ otsikko, sisalto, kehotus, template = 'perus' }) {
  const templates = {
    perus: perusTemplate,
    tumma: tummaTemplate,
    minimalistinen: minimalistinenTemplate,
  };

  const selectedTemplate = templates[template] || templates.perus;
  return selectedTemplate({ otsikko, sisalto, kehotus });
}