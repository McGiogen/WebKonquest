import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {PlayPage} from '../pages/play/play';
import {AboutPage} from '../pages/about/about';
import {HomePage} from '../pages/home/home';
import {OptionsPage} from '../pages/options/options';
import {GameoverPage} from '../pages/gameover/gameover';
import {SetupGamePage} from '../pages/setup-game/setup-game';

//import {StatusBar} from '@ionic-native/status-bar';
//import {SplashScreen} from '@ionic-native/splash-screen';
import {ComponentsModule} from "../components/components.module";
import { GameServerService } from '../pages/play/helper/gameserver.service';

@NgModule({
  declarations: [
    MyApp,
    PlayPage,
    AboutPage,
    OptionsPage,
    GameoverPage,
    SetupGamePage,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
    SetupGamePage,
    HomePage
  ],
  providers: [
    //StatusBar,
    //SplashScreen,
    GameServerService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
