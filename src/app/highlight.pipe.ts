import { Pipe, PipeTransform } from '@angular/core';

import { RulesService } from './rules.service';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private rulesService: RulesService) {}

  transform(value: any, searchString: any, mutateIndex?: string): any {
    if (!searchString || !value) {
      return value;
    }

    const re = new RegExp(`<img.*?>|(${searchString})`, 'gi');
    return value.replace(re, (img, match) => {
      if (!match) {
        return img;
      }

      if (mutateIndex) {
        this.rulesService.setVisibility(mutateIndex);
      }

      return '<mark>' + match + '</mark>';
    });
  }
}
