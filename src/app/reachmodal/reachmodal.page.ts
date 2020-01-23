import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as shuffle from 'lodash.shuffle';

@Component({
  selector: 'app-reachmodal',
  templateUrl: './reachmodal.page.html',
  styleUrls: ['./reachmodal.page.scss'],
})
export class ReachModalPage implements OnInit {

  public playerCount = 4;

  public chosenFactions = { };

  public reachValues = [
    { name: 'Marquise de Cat',      value: 10 },
    { name: 'Underground Duchy',    value: 8 },
    { name: 'Eyrie Dynasties',      value: 7 },
    { name: 'Vagabond (#1)',        value: 5 },
    { name: 'Riverfolk Company',    value: 5 },
    { name: 'Woodland Alliance',    value: 3 },
    { name: 'Corvid Conspiracy',    value: 3 },
    { name: 'Vagabond (#2)',        value: 2, requires: 'Vagabond (#1)' },
    { name: 'Lizard Cult',          value: 2 },
  ];

  public reachesForPlayer = {
    2: 17,
    3: 18,
    4: 21,
    5: 25,
    6: 28
  };

  constructor(private modalCtrl: ModalController) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

  calculate() {
    this.chosenFactions = {};

    let chosenFactions = {};
    let numFactions = 0;
    let score = 0;

    do {
      chosenFactions = {};
      numFactions = 0;
      score = 0;

      const shuffled = shuffle(this.reachValues);
      shuffled.slice(0, this.playerCount).forEach(({ name, value, requires }) => {
        if (requires && !chosenFactions[requires]) { return; }

        chosenFactions[name] = true;
        score += value;
        numFactions++;
      });

    } while (numFactions !== this.playerCount || score < this.reachesForPlayer[this.playerCount]);

    this.chosenFactions = chosenFactions;
  }

}
