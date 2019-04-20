
const yaml = require('js-yaml');
const fs = require('fs');

const file = fs.readFileSync('src/assets/rules.yml', 'UTF-8');
const json = yaml.safeLoad(file);

fs.writeFileSync('src/assets/rules.json', JSON.stringify(json));

const faqFile = fs.readFileSync('src/assets/faq.yml', 'UTF-8');
const faqJson = yaml.safeLoad(faqFile);

fs.writeFileSync('src/assets/faq.json', JSON.stringify(faqJson));
