import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy, HostListener } from '@angular/core';

import { get } from 'lodash';

import { RulesService } from '../rules.service';
import { IonContent, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FAQModalPage } from '../faqmodal/faqmodal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(IonContent)
  public contentEl: IonContent;

  public showScrollUp: boolean;
  public showSearch: boolean;
  public searchTerm: string;

  private nav$: Subscription;

  constructor(private modalCtrl: ModalController, public rulesService: RulesService) {}

  ngOnInit() {
    this.nav$ = this.rulesService.navigate$.subscribe(id => this.scrollToEl(id, 'start'));
  }

  ngAfterContentInit() {
    setTimeout(() => {
      if (!window.location.hash) { return; }
      this.scrollToEl(window.location.hash, 'start');
    }, 1500);
  }

  ngOnDestroy() {
    this.nav$.unsubscribe();
  }

  public toggleSearch() {
    this.showSearch = !this.showSearch;

    if (!this.showSearch) {
      this.setSearchValue(null);
    }
  }

  public setSearchValue(str: string) {
    this.searchTerm = str;
    this.rulesService.resetVisibility();

    if (str === null) { this.showSearch = false; }
  }

  public async openFAQ() {
    const modal = await this.modalCtrl.create({
      component: FAQModalPage
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      this.scrollToEl(this.rulesService.indexesToRules[data]);
    });

    await modal.present();
  }

  public isVisible(index: string[]): boolean {
    if (!this.searchTerm) { return true; }
    return get(this.rulesService.indexVisibilityHash, [...index, 'visible'], false);
  }

  public scroll($event) {
    this.showScrollUp = $event.detail.scrollTop > window.innerHeight;
  }

  public scrollToEl(id: string, block: ScrollLogicalPosition = 'start') {
    if (id.startsWith('#')) { id = id.substring(1); }

    const el = document.getElementById(id);
    if (!el) { return; }

    el.scrollIntoView({
      behavior: 'smooth',
      block
    });

    setTimeout(() => {
      window.location.hash = `#${id}`;
    }, 500);
  }

  @HostListener('document:click', ['$event'])
  public clickScreen($event) {
     if (!$event.target || !$event.target.hash) { return; }

     $event.preventDefault();
     $event.stopPropagation();

     this.scrollToEl($event.target.hash, 'start');
  }
}
