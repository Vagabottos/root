import { Injectable } from '@angular/core';

import * as marked from 'marked';
import slugify from 'slugify';

import * as rules from '../assets/rules.json';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  public get rules() {
    return (rules as any).default || rules;
  }

  public slugTitle(index: string, title: string): string {
    return `${index}-${slugify(title.toLowerCase())}`;
  }

  private getCustomRenderer(allRules: any[]): marked.Renderer {
    const renderer = new marked.Renderer();

    // custom inline image formatter
    renderer.codespan = (text: string) => {
      if (text.includes(':')) {
        const [type, subtype] = text.split(':');

        if (type === 'rule') {
          const [major, minor, child] = subtype.split('.');
          let chosenNode = null;

          if (major) { chosenNode = allRules[(+major) - 1]; }
          if (minor && chosenNode) { chosenNode = chosenNode.children[(+minor) - 1]; }
          if (child && chosenNode) { chosenNode = chosenNode.children[(+child) - 1]; }

          if (!chosenNode) { return `<span class="error">Not Found: ${subtype}</span>`; }

          return `<a href="#${this.slugTitle(subtype, chosenNode.name)}">${subtype}</a>`;
        }

        return `<img src="assets/inicon/${type}-${subtype}.png" class="inline-icon" />`;
      }

      return `<pre>${text}</pre>`;
    };

    renderer.strong = (text: string) => `<strong class="emph">${text}</strong>`;

    // no paragraphs
    renderer.paragraph = (text: string) => text;

    return renderer;
  }

  public getFormattedRules() {
    const baseRules = JSON.parse(JSON.stringify(this.rules));
    const renderer = this.getCustomRenderer(baseRules);

    const format = (str: string) => {
      if (!str) { return; }
      return marked(str, { renderer });
    };

    baseRules.forEach((rule, majorRuleIndex) => {
      rule.text = format(rule.text);
      rule.pretext = format(rule.pretext);
      rule.index = `${majorRuleIndex + 1}.`;

      (rule.children || []).forEach((childRule, minorRuleIndex) => {
        childRule.text = format(childRule.text);
        childRule.pretext = format(childRule.pretext);
        childRule.index = `${majorRuleIndex + 1}.${minorRuleIndex + 1}`;

        (childRule.children || []).forEach((grandchildRule, revRuleIndex) => {
          grandchildRule.text = format(grandchildRule.text);
          grandchildRule.pretext = format(grandchildRule.pretext);
          grandchildRule.index = `${majorRuleIndex + 1}.${minorRuleIndex + 1}.${revRuleIndex + 1}`;

          (grandchildRule.subchildren || []).forEach(descendantNode => {
            descendantNode.text = format(descendantNode.text);
          });
        });
      });
    });

    return baseRules;
  }
}
