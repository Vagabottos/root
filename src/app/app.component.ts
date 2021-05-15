import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';

import { interval } from 'rxjs';

import { RulesService } from './rules.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  public language: string;

  constructor(
    private translateService: TranslateService,
    private updates: SwUpdate,

    public rulesService: RulesService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.language = localStorage.getItem('language');
    if (!this.language) {
      const baseLang = navigator.language || 'en-US';
      if (baseLang.split('-')[0] === 'fr') {
        this.language = 'fr-FR';
      } else {
        this.language = 'en-US';
      }
    }

    this.updateTranslate();
  }

  public languageChange() {
    localStorage.setItem('language', this.language);

    this.updateTranslate();
  }

  private updateTranslate() {
    this.translateService.use(this.language);
    this.rulesService.loadRules();
  }

  initializeApp() {
    this.watchAppChanges();
  }

  private watchAppChanges() {
    if (!this.updates.isEnabled) { return; }

    interval(1000 * 60 * 15).subscribe(() => this.updates.checkForUpdate());
    this.updates.checkForUpdate();
  }
}
