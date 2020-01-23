import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { HighlightPipe } from '../highlight.pipe';
import { FAQModalPage } from '../faqmodal/faqmodal.page';
import { ReachModalPage } from '../reachmodal/reachmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, FAQModalPage, ReachModalPage, HighlightPipe],
  entryComponents: [FAQModalPage, ReachModalPage]
})
export class HomePageModule {}
