import { Injectable } from '@angular/core';

import * as marked from 'marked';
import { convert as toRoman } from 'roman-numeral';
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
          const [major, minor, child, desc, descDesc] = subtype.split('.');
          let chosenNode = null;
          let chosenString = '';

          if (major) {
            chosenString += major;
            chosenNode = allRules[(+major) - 1];
          }

          if (minor && chosenNode) {
            chosenString += `.${minor}`;
            chosenNode = chosenNode.children[(+minor) - 1];
          }

          if (child && chosenNode) {
            chosenString += `.${child}`;
            chosenNode = chosenNode.children[(+child) - 1];
          }

          if (desc && chosenNode)  {
            chosenString += `.${toRoman(desc)}`;
            chosenNode = chosenNode.subchildren[(+desc) - 1];
          }

          if (descDesc && chosenNode)  {
            chosenString += `${String.fromCharCode((+descDesc) + 97)}`;
            chosenNode = chosenNode.subchildren[(+descDesc) - 1];
          }

          if (!chosenNode) { return `<span class="error">Not Found: ${subtype}</span>`; }

          return `<a href="#${this.slugTitle(subtype, chosenNode.name)}">${chosenString}</a>`;
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

    const buildIndex = (arr: string[]) => arr.join('.');

    baseRules.forEach((rule, majorRuleIndex) => {
      rule.text = format(rule.text);
      rule.pretext = format(rule.pretext);
      rule.index = `${majorRuleIndex + 1}.`;

      (rule.children || []).forEach((childRule, minorRuleIndex) => {
        childRule.text = format(childRule.text);
        childRule.pretext = format(childRule.pretext);
        childRule.index = buildIndex([majorRuleIndex + 1, minorRuleIndex + 1]);

        (childRule.children || []).forEach((grandchildRule, revRuleIndex) => {
          grandchildRule.text = format(grandchildRule.text);
          grandchildRule.pretext = format(grandchildRule.pretext);
          grandchildRule.index = buildIndex([majorRuleIndex + 1, minorRuleIndex + 1, revRuleIndex + 1]);

          (grandchildRule.subchildren || []).forEach((descendantNode, descRuleIndex) => {
            descendantNode.text = format(descendantNode.text);
            descendantNode.index = buildIndex([majorRuleIndex + 1, minorRuleIndex + 1, revRuleIndex + 1, descRuleIndex + 1]);

            (descendantNode.subchildren || []).forEach((descDescendantNode, descDescRuleIndex) => {
              descDescendantNode.text = format(descDescendantNode.text);
              descDescendantNode.index = buildIndex(
                [majorRuleIndex + 1, minorRuleIndex + 1, revRuleIndex + 1, descRuleIndex + 1, descDescRuleIndex + 1]
              );
            });
          });
        });
      });
    });

    return baseRules;
  }
}
