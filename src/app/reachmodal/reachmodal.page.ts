import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as shuffle from 'lodash.shuffle';
import * as sort from 'lodash.sortby';

enum ListStatus {
  Default = 0,
  Whitelist = 1,
  Blacklist = -1
}

type RandomMode = 'random' | 'draft+1' | 'adset';

@Component({
  selector: 'app-reachmodal',
  templateUrl: './reachmodal.page.html',
  styleUrls: ['./reachmodal.page.scss'],
})
export class ReachModalPage implements OnInit {

  public mode: RandomMode = 'adset';
  public readonly modeButtons: Array<{ mode: RandomMode, setup: string, icon: string }> = [
    { mode: 'random',  setup: 'Random',       icon: 'sync-outline' },
    { mode: 'draft+1', setup: 'DraftPlusOne', icon: 'person-add' },
    { mode: 'adset',   setup: 'AdSet',        icon: 'options' }
  ];

  public playerCount = 4;

  public unableToSelect = false;

  public factionWhiteBlacklist: Record<string, ListStatus> = { };

  public chosenFactions = { };

  public draftOrder = [ ];

  public readonly reachValues = [
    { name: 'Marquise de Cat',      icon: 'marquise',   shortName: 'Marquise',    value: 10, red: true },
    { name: 'Lord of the Hundreds', icon: 'warlord',    shortName: 'Hundreds',    value: 9,  red: true },
    { name: 'Keepers in Iron',      icon: 'keepers',    shortName: 'Keepers',     value: 8,  red: true },
    { name: 'Underground Duchy',    icon: 'duchy',      shortName: 'Duchy',       value: 8,  red: true },
    { name: 'Eyrie Dynasties',      icon: 'eyrie',      shortName: 'Eyrie',       value: 7,  red: true },
    { name: 'Vagabond (#1)',        icon: 'vagabond1',  shortName: 'Vagabond #1', value: 5,  disables: 'Vagabond (#2)' },
    { name: 'Riverfolk Company',    icon: 'riverfolk',  shortName: 'Riverfolk',   value: 5 },
    { name: 'Woodland Alliance',    icon: 'woodland',   shortName: 'Woodland',    value: 3 },
    { name: 'Corvid Conspiracy',    icon: 'corvid',     shortName: 'Corvids',     value: 3 },
    { name: 'Vagabond (#2)',        icon: 'vagabond2',  shortName: 'Vagabond #2', value: 2,  requires: 'Vagabond (#1)' },
    { name: 'Lizard Cult',          icon: 'cult',       shortName: 'Cult',        value: 2 },
  ];

  public readonly vagabonds = [
    'Arbiter',
    'Ranger',
    'Scoundrel',
    'Thief',
    'Tinker',
    'Vagrant',
    'Adventurer',
    'Ronin',
    'Harrier'
  ];

  public readonly mapNames = [
    'fall',
    'winter',
    'lake',
    'mountain'
  ];

  public readonly decks = [
    'Standard',
    'EP'
  ];

  public readonly landmarks = [
    'ElderTreetop',
    'LostCity',
    'BlackMarket',
    'LegendaryForge',
    'TheFerry',
    'TheTower'
  ];

  public readonly hirelings = [
    { d: 'Spring Uprising',     r: 'Rabbit Scouts',     baseFaction: 'Woodland Alliance' },
    { d: 'Forest Patrol',       r: 'Feline Physicians', baseFaction: 'Marquise de Cat' },
    { d: 'Last Dynasty',        r: 'Bluebird Nobles',   baseFaction: 'Eyrie Dynasties' },
    { d: 'The Exile',           r: 'The Brigand',       baseFaction: 'Vagabond' },
    { d: 'Popular Band',        r: 'Street Band',       baseFaction: '',                pink: true },
    { d: 'Furious Protector',   r: 'Stoic Protector',   baseFaction: '',                pink: true },
    { d: 'Highway Bandits',     r: 'Bandit Gangs',      baseFaction: '',                pink: true },
    { d: 'Riverfolk Flotilla',  r: 'Otter Divers',      baseFaction: 'Riverfolk Company' },
    { d: 'Warm Sun Prophets',   r: 'Lizard Envoys',     baseFaction: 'Lizard Cult' },
    { d: 'Sunward Expedition',  r: 'Mole Artisans',     baseFaction: 'Underground Duchy' },
    { d: 'Corvid Spies',        r: 'Raven Sentries',    baseFaction: 'Corvid Conspiracy' },
    { d: 'Flame Bearers',       r: 'Rat Smugglers',     baseFaction: 'Lord of the Hundreds' },
    { d: 'Vault Keepers',       r: 'Badger Bodyguards', baseFaction: 'Keepers in Iron' }
  ];

  public readonly formattedHirelings = this.hirelings.map(h => `${h.d} (D) / ${h.r} (R)`).sort();
  public readonly formattedFactions = this.reachValues.map(x => x.name).sort();

  public readonly reachesForPlayer = {
    2: 17,
    3: 18,
    4: 21,
    5: 25,
    6: 28
  };

  public adsetSettings = {
    map: 'random',
    deck: 'random',
    playerCount: 4,
    landmarks: ['random: 2'],
    validHirelings: this.formattedHirelings,
    validFactions: this.formattedFactions
  };

  public adsetGenerated = {
    map: '',
    deck: '',
    landmarks: [],
    hirelings: [],
    factions: []
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

    const valueSumLowestFactions = (factions: Record<string, number>) => {
      const values = Object.values(factions);
      return sort(values)
        .slice(0, values.length - 1)
        .reduce((prev, cur) => prev + cur, 0);
    };

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

    } while (numFactions !== this.playerCount + 1 || valueSumLowestFactions(chosenFactions) < 17);

    if (this.unableToSelect) {
      this.unableToSelect = true;
      return;
    }

    this.chosenFactions = chosenFactions;

    this.draftOrder = shuffle(Array(this.playerCount).fill(null).map((n, i) => String.fromCharCode(65 + i)));
  }

  changeRandomType(mode: RandomMode) {
    this.mode = mode;

    this.factionWhiteBlacklist = {};
    this.chosenFactions = {};
    this.unableToSelect = false;

    this.playerCount = 4;
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

  validateADSETLandmarkChoices() {
    setTimeout(() => {
      if (this.adsetSettings.landmarks.includes('none')) {
        this.adsetSettings.landmarks = ['none'];
        return;
      }

      if (this.adsetSettings.landmarks.includes('random: 2')) {
        this.adsetSettings.landmarks = ['random: 2'];
      }

      if (this.adsetSettings.landmarks.includes('random: 1')) {
        this.adsetSettings.landmarks = ['random: 1'];
      }

      if (this.adsetSettings.landmarks.length > 2) {
        this.adsetSettings.landmarks = this.adsetSettings.landmarks.slice(0, 2);
      }

      if (this.adsetSettings.landmarks.length === 0) {
        this.adsetSettings.landmarks.push('random: 2');
      }
    }, 0);
  }

  validateADSETHirelingChoices() {
    setTimeout(() => {

      if (this.adsetSettings.validHirelings.includes('none')) {
        this.adsetSettings.validHirelings = ['none'];
        return;
      }

      if (this.adsetSettings.validHirelings.includes('all')) {
        this.adsetSettings.validHirelings = this.formattedHirelings.slice(0);
        return;
      }

      if (this.adsetSettings.validHirelings.length < 3) {
        this.adsetSettings.validHirelings = this.formattedHirelings.slice(0);
      }
    }, 0);
  }

  validateADSETFactionChoices() {
    setTimeout(() => {

      if (this.adsetSettings.validFactions.includes('all')) {
        this.adsetSettings.validFactions = this.formattedFactions.slice(0);
        return;
      }

      if (this.adsetSettings.validFactions.length < this.adsetSettings.playerCount + 1) {
        this.adsetSettings.validFactions = this.formattedFactions.slice(0);
      }

      if (this.adsetSettings.validFactions.every(x => !this.reachValues.find(r => r.name === x).red)) {
        this.adsetSettings.validFactions = this.formattedFactions.slice(0);
      }
    }, 0);
  }

  calculateForADSET() {
    this.unableToSelect = false;
    this.adsetGenerated.factions = [];

    if (this.adsetSettings.deck === 'random') {
      this.adsetGenerated.deck = shuffle(this.decks)[0];
    } else {
      this.adsetGenerated.deck = this.adsetSettings.deck;
    }

    if (this.adsetSettings.map === 'random') {
      this.adsetGenerated.map = shuffle(this.mapNames)[0];
    } else {
      this.adsetGenerated.map = this.adsetSettings.map;
    }

    if (this.adsetSettings.landmarks.includes('random: 2')) {
      this.adsetGenerated.landmarks = shuffle(this.landmarks).slice(0, 2);
    } else if (this.adsetSettings.landmarks.includes('random: 1')) {
      this.adsetGenerated.landmarks = shuffle(this.landmarks).slice(0, 1);
    } else if (this.adsetSettings.landmarks.includes('none')) {
      this.adsetGenerated.landmarks = ['none'];
    } else {
      this.adsetGenerated.landmarks = this.adsetSettings.landmarks;
    }

    const numPlayers = this.adsetSettings.playerCount;

    if (!this.adsetSettings.validHirelings.includes('none')) {
      const validHirelings = shuffle(this.adsetSettings.validHirelings).slice(0, 3);

      this.adsetGenerated.hirelings[0] = validHirelings[0].split('/')[numPlayers >= 3 ? 1 : 0].trim();
      this.adsetGenerated.hirelings[1] = validHirelings[1].split('/')[numPlayers >= 4 ? 1 : 0].trim();
      this.adsetGenerated.hirelings[2] = validHirelings[2].split('/')[numPlayers >= 5 ? 1 : 0].trim();
    } else {
      this.adsetGenerated.hirelings = ['none'];
    }

    const ignoreFactions = {};
    this.adsetGenerated.hirelings.forEach(h => {
      const split = h.split('(')[0].trim();

      const foundRef = this.hirelings.find(x => x.r === split || x.d === split);
      if (foundRef) {
        if (foundRef.baseFaction === 'Vagabond') {
          ignoreFactions['Vagabond (#1)'] = true;
          ignoreFactions['Vagabond (#2)'] = true;
        } else {
          ignoreFactions[foundRef.baseFaction] = true;
        }
      }
    });

    const allFactions = JSON.parse(JSON.stringify(this.reachValues.filter(x => this.adsetSettings.validFactions.includes(x.name))));
    let validFactions = shuffle(allFactions).filter(x => !ignoreFactions[x.name]);
    if (numPlayers === 2) {
      validFactions = validFactions.filter(x => x.red);
    }

    const firstFaction = shuffle(validFactions).filter(x => x.red)[0];
    const chosenFactions = [firstFaction].concat(shuffle(validFactions).filter(x => x !== firstFaction).slice(0, numPlayers));

    if (!chosenFactions[chosenFactions.length - 1].red) {
      chosenFactions[chosenFactions.length - 1].hide = true;
    }

    if (chosenFactions.length !== numPlayers + 1) {
      this.unableToSelect = true;
      return;
    }

    const vagabonds = {};

    chosenFactions.forEach(f => {
      if (!f.name.includes('(#')) { return; }

      const getVagabond = () => {
        let chosenVagabond;

        do {
          chosenVagabond = shuffle(this.vagabonds)[0];
        } while (vagabonds[chosenVagabond]);

        vagabonds[chosenVagabond] = true;

        return chosenVagabond;
      };

      f.vagabondName = getVagabond();
    });

    this.adsetGenerated.factions = chosenFactions;
  }

}
