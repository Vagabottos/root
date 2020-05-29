import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as shuffle from 'lodash.shuffle';

@Component({
  selector: 'app-mapmodal',
  templateUrl: './mapmodal.page.html',
  styleUrls: ['./mapmodal.page.scss'],
})
export class MapModalPage implements OnInit {

  public suits = [];

  public activeMap = '';

  public mapData = {
    fall: {
      clearingPositions: [
        [18, 18],
        [358, 89],
        [362, 367],
        [16, 320],
        [233, 23],
        [370, 206],
        [248, 320],
        [140, 364],
        [19, 134],
        [157, 87],
        [264, 192],
        [124, 227]
      ]
    },
    winter: {
      clearingPositions: [
        [18, 10],
        [364, 7],
        [364, 337],
        [22, 302],
        [137, 18],
        [243, 38],
        [368, 181],
        [251, 294],
        [145, 341],
        [12, 159],
        [147, 164],
        [264, 170]
      ]
    },
    lake: {
      clearingPositions: [
        [353, 319],
        [24, 10],
        [25, 307],
        [366, 7],
        [370, 181],
        [267, 39],
        [163, 19],
        [16, 161],
        [230, 342],
        [135, 136],
        [267, 171],
        [152, 260]
      ]
    },
    mountain: {
      clearingPositions: [
        [22, 15],
        [362, 16],
        [364, 350],
        [26, 310],
        [227, 26],
        [367, 191],
        [189, 348],
        [16, 165],
        [117, 126],
        [204, 143],
        [253, 232],
        [124, 228]
      ]
    }
  };

  constructor(private modalCtrl: ModalController) { }

  public changeMap(newMap: string) {
    this.activeMap = newMap.toLowerCase();
    this.randomize();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    this.changeMap('mountain');
  }

  randomize() {
    const { clearingPositions } = this.mapData[this.activeMap];

    this.suits = [];

    let availableSuits = ['bunny', 'bunny', 'bunny', 'bunny', 'fox', 'fox', 'fox', 'fox', 'mouse', 'mouse', 'mouse', 'mouse'];

    clearingPositions.forEach((pos, i) => {
      availableSuits = shuffle(availableSuits);
      const firstSuit = availableSuits[0];
      this.suits[i] = firstSuit;

      availableSuits = availableSuits.slice(1);
    });
  }

}
