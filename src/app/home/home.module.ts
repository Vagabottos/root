import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { HighlightPipe } from '../highlight.pipe';
import { FAQModalPage } from '../faqmodal/faqmodal.page';
import { ReachModalPage } from '../reachmodal/reachmodal.page';
import { MapModalPage } from '../mapmodal/mapmodal.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, FAQModalPage, ReachModalPage, MapModalPage, HighlightPipe],
  entryComponents: [FAQModalPage, ReachModalPage, MapModalPage]
})
export class HomePageModule {}
