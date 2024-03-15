import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

import * as enUS from '../assets/i18n/en-US.json';
import * as esES from '../assets/i18n/es-ES.json';
import * as deDE from '../assets/i18n/de-DE.json';
import * as ruRU from '../assets/i18n/ru-RU.json';
import * as plPL from '../assets/i18n/pl-PL.json';

const langs = {
  'en-US': (enUS as any).default || enUS,
  'es-ES': (esES as any).default || esES,
  'de-DE': (deDE as any).default || deDE,
  'ru-RU': (ruRU as any).default || ruRU,
  'pl-PL': (plPL as any).default || plPL,
};

export class JSONLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(langs[lang] || enUS);
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: JSONLoader
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
