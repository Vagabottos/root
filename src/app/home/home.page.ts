import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy, HostListener } from '@angular/core';

import { RulesService } from '../rules.service';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(IonContent)
  public contentEl: IonContent;

  public showScrollUp: boolean;

  private nav$: Subscription;

  constructor(public rulesService: RulesService) {}

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
  }

  @HostListener('document:click', ['$event'])
  public clickScreen($event) {
    if (!$event.target || !$event.target.hash) { return; }

    $event.preventDefault();
    $event.stopPropagation();

    this.scrollToEl($event.target.hash, 'start');
  }
}
