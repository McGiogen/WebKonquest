import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {PlayPage} from '../pages/play/play';
import {AboutPage} from '../pages/about/about';
import {HomePage} from '../pages/home/home';
import {OptionsPage} from '../pages/options/options';
import {GameoverPage} from '../pages/gameover/gameover';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ComponentsModule} from "../components/components.module";

@NgModule({
  declarations: [
    MyApp,
    PlayPage,
    AboutPage,
    OptionsPage,
    GameoverPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlayPage,
    AboutPage,
    OptionsPage,
    GameoverPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
