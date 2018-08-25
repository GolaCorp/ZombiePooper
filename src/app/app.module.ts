import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GameoverPage } from '../pages/gameover/gameover'
import { AdMobFree} from '@ionic-native/admob-free';
import { LevelsPage } from '../pages/levels/levels'
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LevelsPage,
    GameoverPage,
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LevelsPage,
    GameoverPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AdMobFree,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
