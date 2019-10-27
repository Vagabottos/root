
const fs = require('fs');
const xray = require('x-ray');
const yaml = require('js-yaml');

const file = fs.readFileSync('src/assets/rules.yml', 'UTF-8');
const rules = yaml.safeLoad(file);

const x = xray({
  /*
  filters: {
    trim: function(value) {
      return typeof value === 'string' ? value.trim() : value
    }
  }
  */
});

const getLivingRules = async () => {
  let res = await x('http://root.livingrules.io', '#body-container ol');

  const replacers = ["’"];
  replacers.forEach(rep => res = res.split(rep).join("'"));

  const replacersD = ['"', '“', '”', '”', '“'];
  replacersD.forEach(rep => res = res.split(rep).join('"'));

  const ignoreStrings = [
    'These final two sections refer to factions a	vailable in The Riverfolk Expansion.',
    'This phase has two steps in the following order.',
    'Your Evening has four steps, as follows.',
    `Catering to those creatures who have been discarded by the other factions, the Lizard Cult seeks to overwhelm its foes through sheer force of will. The Cult relies on word of mouth and beak to spread its gospel, and new enclaves can spring up anywhere on the map.`,
    `Where the Cult rule clearings, they can build gardens, which will further radicalize the animals that live there. While other factions spend cards to achieve their aims, the Cult acts chiefly by revealing cards and gradually drafting the ideal set of followers.`,
    `Unless used for scoring, these cards are not spent and are returned to the Cult's hand during Evening. However, this gentler approach makes movement and combat operations difficult, so these actions can only be undertaken by the most radicalized members of the Cult.`,
    'Step 2: Roll Dice and Add Extra Hits.'
  ];

  ignoreStrings.forEach(str => res = res.replace(str, ''));

  const strictReplacers = [
    { repl: '(4.2.2.I)', replVal: '(4.3.2.1)' },
    { repl: '(4.3.2.III)', replVal: '(4.3.2.3)' },
    { repl: '(9.2.9.IIIb)', replVal: '(9.2.9.3.2)' },
    { repl: '(9.2.9.IIb)', replVal: '(9.2.9.2.2)' },
    { repl: '(9.2.9.IIc)', replVal: '(9.2.9.2.3)' },
    { repl: '(9.2.9.III)', replVal: '(9.2.9.3)' },
  ];

  strictReplacers.forEach(({ repl, replVal }) => {
    res = res.replace(repl, replVal);
  });

  // res = res.replace(/\s\s+/g, ' ');
  /*
  lol @ thinking these are organized enough to do this-

  - subsection rules aren't in their own span so getting them gets the subrules as well
  - some headers aren't wrapped correctly; E<span>xample</span> for several of them

  the approach of getting the blob of text and using our own well-formatted rules will be an easier result, I suppose.

  const res = await x('http://root.livingrules.io', '#body-container ol li.Header', [
    {
      title: 'h2 a | trim',
      sections: x('ol .Section', [
        {
          title: '.Section-Name a | trim',
          text: '.Section-Rules | trim',
          sections: x('ol .Subsection', [
            {
              title: '.Subsection-Rule-Name',
              text: '@text',
              sections: x('ol .Sub-sub-section', [
                { 
                  title: '.Subsection-Rule-Name',
                  text: '@text',
                  sections: x('old .Sub-sub-sub-section', [
                    {
                      title: '.Subsection-Rule-Name',
                      text: '@text'
                    }
                  ])
                }
              ])
            }
          ])
        }
      ])
    }
  ]);
  
  const processRules = (rules) => {
    return rules.map(x => {
      if(x.sections) {
        x.sections = processRules(x.sections);
      }

      return x;
    });
  };

  const rules = processRules(res);
  
  console.log(JSON.stringify(rules[8], null, 4));
  */
  return res;
};

const formatStringForReplacement = (text) => {    
  while(text.includes('faction:')) text = text.replace(/`faction:[a-zA-Z0-9:.]+`/, '');

  while(text.includes('item:')) text = text.replace(/`item:[a-zA-Z0-9:.]+`/, '');

  text = text.split('rule:').join('');

  text = text.split('**').join('');

  text = text.split('_').join('');

  text = text.split('`').join('');

  text = text.trim();

  return text;
};

const unparseText = (bigRules, myIndividualRules) => {

  let curRules = bigRules;

  const recurse = (rule, replace = []) => {
    if(rule.children || rule.subchildren) {
      (rule.children || rule.subchildren).forEach(child => recurse(child, replace));
    }

    replace.forEach(repl => {
      if(!rule[repl]) return;

      const reformatted = formatStringForReplacement(rule[repl]);
      curRules = curRules.replace(reformatted, '');
    });
  };

  myIndividualRules.forEach(rule => recurse(rule, ['pretext', 'text', 'subtext']));
  myIndividualRules.forEach(rule => recurse(rule, ['name']));

  return curRules;
};

const cleanText = (text) => {

  text = text.replace(/\s\s+/g, ' ');
  text = text.split(' . ').join('');

  if(text.length < 100) text = '';

  return text;
};

const init = async () => {
  try {
    const ruleBlob = await getLivingRules();
    const remainingText = unparseText(ruleBlob, rules);
    const clean = cleanText(remainingText);

    if(clean) {
      console.error('Some rules were updated.');
      console.error(clean);
      process.exit(1);
    }
  } catch(e) {
    console.error('INVALID RULE ERROR', e);
  }
};

init();