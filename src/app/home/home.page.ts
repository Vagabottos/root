import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';

import { RulesService } from '../rules.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit {

  public rules: any[] = [];

  @ViewChild(IonContent)
  public contentEl: IonContent;

  public showScrollUp: boolean;

  constructor(public rulesService: RulesService) {}

  ngOnInit() {
    this.rules = this.rulesService.getFormattedRules();
  }

  ngAfterContentInit() {
    setTimeout(() => {
      if (!window.location.hash) { return; }
      this.scrollToEl(window.location.hash, 'start');
    }, 1500);
  }

  public scroll($event) {
    this.showScrollUp = $event.detail.scrollTop > window.innerHeight;
  }

  public scrollToEl(id: string, block: ScrollLogicalPosition = 'center') {
    if (id.startsWith('#')) { id = id.substring(1); }

    const el = document.getElementById(id);
    el.scrollIntoView({
      behavior: 'smooth',
      block
    });
  }
}
