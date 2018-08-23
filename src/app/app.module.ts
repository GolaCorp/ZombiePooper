import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Screenshot } from '@ionic-native/screenshot';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GameoverPage } from '../pages/gameover/gameover'
import { AdMobFree} from '@ionic-native/admob-free';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GameoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GameoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    Screenshot,
    AdMobFree,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
