import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';

import * as enUSFAQ from '../../assets/i18n/faq/en-US.json';
import * as esESFAQ from '../../assets/i18n/faq/es-ES.json';
import * as deDEFAQ from '../../assets/i18n/faq/de-DE.json';
import * as ruRUFAQ from '../../assets/i18n/faq/ru-RU.json';
import * as plPLFAQ from '../../assets/i18n/faq/pl-PL.json';

const faq = {
  'en-US': (enUSFAQ as any).default || enUSFAQ,
  'es-ES': (esESFAQ as any).default || esESFAQ,
  'de-DE': (deDEFAQ as any).default || deDEFAQ,
  'ru-RU': (ruRUFAQ as any).default || ruRUFAQ,
  'pl-PL': (plPLFAQ as any).default || plPLFAQ,
};

@Component({
  selector: 'app-faqmodal',
  templateUrl: './faqmodal.page.html',
  styleUrls: ['./faqmodal.page.scss'],
})
export class FAQModalPage {

  public get faq() {
    return faq[localStorage.getItem('language') || 'en-US'] || enUSFAQ;
  }

  constructor(private modalCtrl: ModalController) {}

  dismiss(id?: string) {
    this.modalCtrl.dismiss(id);
  }

}
