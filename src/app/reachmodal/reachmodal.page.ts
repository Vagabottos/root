import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as shuffle from 'lodash.shuffle';
import * as sort from 'lodash.sortby';

enum ListStatus {
  Default = 0,
  Whitelist = 1,
  Blacklist = -1
}

type RandomMode = 'random' | 'draft+1';

@Component({
  selector: 'app-reachmodal',
  templateUrl: './reachmodal.page.html',
  styleUrls: ['./reachmodal.page.scss'],
})
export class ReachModalPage implements OnInit {

  public mode: RandomMode = 'random';
  public readonly modeButtons: Array<{ mode: RandomMode, icon: string }> = [
    { mode: 'random', icon: 'options' },
    { mode: 'draft+1', icon: 'person-add' }
  ];

  public playerCount = 4;

  public unableToSelect = false;

  public factionWhiteBlacklist: Record<string, ListStatus> = { };

  public chosenFactions = { };

  public draftOrder = [ ];

  public readonly reachValues = [
    { name: 'Marquise de Cat',      icon: 'marquise',   shortName: 'Marquise',    value: 10 },
    { name: 'Underground Duchy',    icon: 'duchy',      shortName: 'Duchy',       value: 8 },
    { name: 'Eyrie Dynasties',      icon: 'eyrie',      shortName: 'Eyrie',       value: 7 },
    { name: 'Vagabond (#1)',        icon: 'vagabond1',  shortName: 'Vagabond #1', value: 5, disables: 'Vagabond (#2)' },
    { name: 'Riverfolk Company',    icon: 'riverfolk',  shortName: 'Riverfolk',   value: 5 },
    { name: 'Woodland Alliance',    icon: 'woodland',   shortName: 'Woodland',    value: 3 },
    { name: 'Corvid Conspiracy',    icon: 'corvid',     shortName: 'Corvids',     value: 3 },
    { name: 'Vagabond (#2)',        icon: 'vagabond2',  shortName: 'Vagabond #2', value: 2, requires: 'Vagabond (#1)' },
    { name: 'Lizard Cult',          icon: 'cult',       shortName: 'Cult',        value: 2 },
  ];

  public readonly reachesForPlayer = {
    2: 17,
    3: 18,
    4: 21,
    5: 25,
    6: 28
  };

  public get chosenFactionsOrdered() {
    return sort(Object.keys(this.chosenFactions), f => -this.chosenFactions[f]);
  }

  public get draftOrderReversed() {
    return this.draftOrder.reverse();
  }

  constructor(private modalCtrl: ModalController) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

  calculateForRandom() {
    this.chosenFactions = {};
    this.unableToSelect = false;

    let attempts = 0;

    let chosenFactions = {};
    let numFactions = 0;
    let score = 0;

    do {
      chosenFactions = {};
      numFactions = 0;
      score = 0;

      const addFaction = (faction) => {
        if (faction.requires && !chosenFactions[faction.requires]) { return; }

        chosenFactions[faction.name] = faction.value;
        score += faction.value;
        numFactions++;
      };

      const availableFactions = this.reachValues
        .filter(x => this.factionWhiteBlacklist[x.name] !== ListStatus.Blacklist);

      const mustFactions = availableFactions
        .filter(x => this.factionWhiteBlacklist[x.name] === ListStatus.Whitelist);

      const otherFactions = availableFactions
        .filter(x => this.factionWhiteBlacklist[x.name] !== ListStatus.Whitelist);

      if (mustFactions.length > this.playerCount) {
        this.unableToSelect = true;
        break;
      }

      mustFactions.forEach(faction => addFaction(faction));

      const shuffled = shuffle(otherFactions);
      shuffled.slice(0, this.playerCount - mustFactions.length).forEach((faction) => addFaction(faction));

      attempts++;

      if (attempts > 100) {
        this.unableToSelect = true;
        break;
      }

    } while (numFactions !== this.playerCount || score < this.reachesForPlayer[this.playerCount]);

    if (this.unableToSelect) {
      this.unableToSelect = true;
      return;
    }

    this.chosenFactions = chosenFactions;
  }


  calculateForDraft() {
    this.chosenFactions = {};
    this.unableToSelect = false;

    let attempts = 0;

    let chosenFactions = {};
    let numFactions = 0;
    let score = 0;

    do {
      chosenFactions = {};
      numFactions = 0;
      score = 0;

      const addFaction = (faction) => {
        if (faction.requires && !chosenFactions[faction.requires]) { return; }

        chosenFactions[faction.name] = faction.value;
        score += faction.value;
        numFactions++;
      };

      const availableFactions = this.reachValues
        .filter(x => this.factionWhiteBlacklist[x.name] !== ListStatus.Blacklist);

      const shuffled = shuffle(availableFactions);
      shuffled.slice(0, this.playerCount + 1).forEach((faction) => addFaction(faction));

      attempts++;

      if (attempts > 100) {
        this.unableToSelect = true;
        break;
      }

    } while (numFactions !== this.playerCount + 1 || score < 17);

    if (this.unableToSelect) {
      this.unableToSelect = true;
      return;
    }

    this.chosenFactions = chosenFactions;

    this.draftOrder = shuffle(Array(this.playerCount).fill(null).map((n, i) => i));
  }

  changeRandomType(mode: RandomMode) {
    this.mode = mode;

    this.factionWhiteBlacklist = {};
    this.chosenFactions = {};
    this.unableToSelect = false;
  }

  toggleFaction(faction) {
    switch (this.factionWhiteBlacklist[faction.name]) {
      case ListStatus.Blacklist: {
        this.factionWhiteBlacklist[faction.name] = ListStatus.Default;
        break;
      }

      case ListStatus.Default: {
        this.factionWhiteBlacklist[faction.name] = ListStatus.Whitelist;
        if (faction.requires) {
          this.factionWhiteBlacklist[faction.requires] = ListStatus.Whitelist;
        }
        break;
      }

      case ListStatus.Whitelist: {
        this.factionWhiteBlacklist[faction.name] = ListStatus.Blacklist;
        if (faction.disables) {
          this.factionWhiteBlacklist[faction.disables] = ListStatus.Blacklist;
        }
        break;
      }

      default: {
        this.factionWhiteBlacklist[faction.name] = ListStatus.Whitelist;
        if (faction.requires) {
          this.factionWhiteBlacklist[faction.requires] = ListStatus.Whitelist;
        }
        break;
      }
    }
  }

}
