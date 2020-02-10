import { Injectable } from '@angular/core';

import * as marked from 'marked';
import { convert as toRoman } from 'roman-numeral';
import slugify from 'slugify';

import * as rules from '../assets/rules.json';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  public indexVisibilityHash = {};

  private indexRuleHash = {};
  public get indexesToRules() {
    return this.indexRuleHash;
  }

  private navigate: Subject<string> = new Subject<string>();
  public get navigate$() {
    return this.navigate;
  }

  private formattedRules: any;
  public get rules() {
    return this.formattedRules;
  }

  public get baseRules() {
    return (rules as any).default || rules;
  }

  constructor() {

    // the formatter needs this to have run once
    // and this needs the formatter to run correctly
    // bad solution: we just run it twice.
    this.formattedRules = this.getFormattedRules();
    this.formattedRules = this.getFormattedRules();
  }

  public slugTitle(index: string, title: string): string {
    const baseString = `${index}-${slugify(title.toLowerCase())}`.split('"').join('');
    if (baseString.match(/^.+(\.)$/)) { return baseString.substring(0, baseString.length - 1); }
    return baseString;
  }

  private getCustomRenderer(allRules: any[]): marked.Renderer {
    const renderer = new marked.Renderer();

    // custom inline image formatter
    renderer.codespan = (text: string) => {
      if (text.includes(':')) {
        const [type, subtype, extra] = text.split(':');

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

          if (desc && chosenNode) {
            chosenString += `.${toRoman(desc)}`;
            chosenNode = chosenNode.subchildren[(+desc) - 1];
          }

          if (descDesc && chosenNode) {
            chosenString += `${String.fromCharCode((+descDesc) + 97)}`;
            chosenNode = chosenNode.subchildren[(+descDesc) - 1];
          }

          if (!chosenNode) { return `<span class="error">Not Found: ${subtype}</span>`; }

          return `<a href="#${this.slugTitle(subtype, chosenNode.name)}" class="rule-link">${chosenString}</a>`;
        }

        if (type === 'faction') {
          return `
            <a href="#${this.indexRuleHash[extra]}">
              <img src="assets/inicon/${type}-${subtype}.png" class="inline-icon" />
            </a>
          `;
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

  private getFormattedRules() {
    const baseRules = JSON.parse(JSON.stringify(this.baseRules));
    const renderer = this.getCustomRenderer(baseRules);

    const format = (str: string) => {
      if (!str) { return; }
      return marked(str, { renderer });
    };

    const buildIndex = (arr: string[]) => arr.join('.');

    baseRules.forEach((rule, majorRuleIndex) => {
      rule.formattedName = format(rule.name);
      rule.text = format(rule.text);
      rule.pretext = format(rule.pretext);
      rule.index = `${majorRuleIndex + 1}.`;
      this.indexRuleHash[rule.index] = this.slugTitle(rule.index,
        rule.plainName || rule.name
      );

      (rule.children || []).forEach((childRule, minorRuleIndex) => {
        childRule.formattedName = format(childRule.name);
        childRule.text = format(childRule.text);
        childRule.pretext = format(childRule.pretext);
        childRule.index = buildIndex([majorRuleIndex + 1, minorRuleIndex + 1]);
        this.indexRuleHash[childRule.index] = this.slugTitle(
          childRule.index, childRule.plainName || childRule.name
        );

        (childRule.children || []).forEach((grandchildRule, revRuleIndex) => {
          grandchildRule.formattedName = format(grandchildRule.name);
          grandchildRule.text = format(grandchildRule.text);
          grandchildRule.pretext = format(grandchildRule.pretext);
          grandchildRule.index = buildIndex([majorRuleIndex + 1, minorRuleIndex + 1, revRuleIndex + 1]);
          this.indexRuleHash[grandchildRule.index] = this.slugTitle(
            grandchildRule.index, grandchildRule.plainName || grandchildRule.name
          );

          (grandchildRule.subchildren || []).forEach((descendantNode, descRuleIndex) => {
            descendantNode.formattedName = format(descendantNode.name);
            descendantNode.text = format(descendantNode.text);
            descendantNode.index = buildIndex([majorRuleIndex + 1, minorRuleIndex + 1, revRuleIndex + 1, descRuleIndex + 1]);
            this.indexRuleHash[descendantNode.index] = this.slugTitle(descendantNode.index,
              descendantNode.plainName || descendantNode.name
            );

            (descendantNode.subchildren || []).forEach((descDescendantNode, descDescRuleIndex) => {
              descDescendantNode.formattedName = format(descDescendantNode.name);
              descDescendantNode.text = format(descDescendantNode.text);
              descDescendantNode.index = buildIndex(
                [majorRuleIndex + 1, minorRuleIndex + 1, revRuleIndex + 1, descRuleIndex + 1, descDescRuleIndex + 1]
              );
              this.indexRuleHash[descDescendantNode.index] = this.slugTitle(
                descDescendantNode.index, descDescendantNode.plainName || descDescendantNode.name
              );
            });
          });
        });
      });
    });

    return baseRules;
  }

  public resetVisibility() {
    this.indexVisibilityHash = {};
  }

  public setVisibility(index: string) {
    if (index.endsWith('.')) { index = index.substring(0, index.length - 1); }
    const allEntries = index.split('.');

    // take care of the first entry
    this.indexVisibilityHash[allEntries[0]] = this.indexVisibilityHash[allEntries[0]] || { visible: true };
    let curObj = this.indexVisibilityHash[allEntries[0]];

    allEntries.shift();

    // iteratively do the rest
    allEntries.forEach(idx => {
      curObj[idx] = curObj[idx] || { visible: true };
      curObj = curObj[idx];
    });
  }
}
