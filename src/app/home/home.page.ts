import { Component, OnInit } from '@angular/core';

import { RulesService } from '../rules.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public rules: any[] = [];

  constructor(public rulesService: RulesService) {}

  ngOnInit() {
    this.rules = this.rulesService.getFormattedRules();
  }
}
