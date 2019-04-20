import { Component } from '@angular/core';

import * as faq from '../../assets/faq.json';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-faqmodal',
  templateUrl: './faqmodal.page.html',
  styleUrls: ['./faqmodal.page.scss'],
})
export class FAQModalPage {

  public get faq() {
    return (faq as any).default || faq;
  }

  constructor(private modalCtrl: ModalController) { }

  dismiss(id?: string) {
    this.modalCtrl.dismiss(id);
  }

}
