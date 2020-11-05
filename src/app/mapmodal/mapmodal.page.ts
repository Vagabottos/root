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

  public balancedError = false;

  public clearingAdjacency = {
    fall: {
      1:  { 5: true, 9: true, 10: true },
      2:  { 5: true, 6: true, 10: true },
      3:  { 6: true, 7: true, 11: true },
      4:  { 8: true, 9: true },
      5:  { 1: true, 2: true },
      6:  { 2: true, 3: true },
      7:  { 3: true, 8: true, 12: true },
      8:  { 4: true, 7: true },
      9:  { 1: true, 4: true, 12: true },
      10: { 1: true, 2: true, 12: true },
      11: { 3: true, 6: true, 12: true },
      12: { 4: true, 7: true, 9: true, 10: true, 11: true }
    },
    winter: {
      1:  { 5: true, 10: true, 11: true },
      2:  { 6: true, 7: true, 12: true  },
      3:  { 7: true, 8: true, 12: true },
      4:  { 9: true, 10: true, 11: true },
      5:  { 1: true, 6: true },
      6:  { 2: true, 5: true },
      7:  { 2: true, 3: true },
      8:  { 3: true, 9: true, 12: true },
      9:  { 4: true, 8: true, 11: true },
      10: { 1: true, 4: true },
      11: { 1: true, 4: true, 9: true },
      12: { 2: true, 3: true, 8: true }
    },
    lake: {
      1:  { 5: true, 9: true },
      2:  { 7: true, 8: true, 10: true },
      3:  { 8: true, 9: true, 12: true },
      4:  { 5: true, 6: true, 11: true },
      5:  { 1: true, 4: true, 11: true },
      6:  { 4: true, 7: true, 11: true },
      7:  { 2: true, 6: true, 10: true, 11: true },
      8:  { 2: true, 3: true, 10: true },
      9:  { 1: true, 3: true, 12: true },
      10: { 2: true, 7: true, 8: true },
      11: { 5: true, 6: true, 7: true },
      12: { 3: true, 9: true }
    },
    mountain: {
      1:  { 8: true, 9: true },
      2:  { 5: true, 6: true, 11: true },
      3:  { 6: true, 7: true, 11: true },
      4:  { 8: true, 12: true },
      5:  { 2: true, 9: true, 10: true, 11: true },
      6:  { 2: true, 3: true, 11: true },
      7:  { 3: true, 12: true },
      8:  { 1: true, 4: true, 9: true },
      9:  { 1: true, 5: true, 8: true, 10: true, 12: true },
      10: { 5: true, 9: true, 11: true, 12: true },
      11: { 2: true, 3: true, 5: true, 6: true, 10: true, 12: true },
      12: { 4: true, 7: true, 9: true, 10: true, 11: true  }
    }
  };

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
    this.changeMap('fall');
  }

  randomize() {
    this.balancedError = false;
    this.suits = shuffle(['bunny', 'bunny', 'bunny', 'bunny', 'fox', 'fox', 'fox', 'fox', 'mouse', 'mouse', 'mouse', 'mouse']);
  }

  balanced() {
    this.balancedError = false;

    let isValid = true;
    let attempts = 0;

    const mapAdjacency = this.clearingAdjacency[this.activeMap];

    do {
      isValid = true;
      this.randomize();

      this.suits.forEach((suit, index) => {
        Object.keys(mapAdjacency[index + 1]).forEach(checkIndex => {
          if (this.suits[(+checkIndex) - 1] !== suit) { return; }
          isValid = false;
        });
      });
    } while (!isValid && attempts++ < 5000);

    if (!isValid) { this.balancedError = true; }

  }

}
