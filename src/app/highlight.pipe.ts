import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (!args || !value) { return value; }
    const re = new RegExp(`<img.*?>|(${args})`, 'gi');
    return value.replace(re, (img, match) => {
      if (!match) { return img; }
      return '<mark>' + match + '</mark>';
    });
  }

}
