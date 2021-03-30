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

const langs = { 
  'en-US': (enUS as any).default || enUS,
  'es-ES': (esES as any).default || esES,
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
