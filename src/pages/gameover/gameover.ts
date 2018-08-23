import { Component,ViewChild,ElementRef } from '@angular/core';
import {  NavController, NavParams,App } from 'ionic-angular';
import { HomePage } from '../home/home'
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';


@Component({
  selector: 'page-gameover',
  templateUrl: 'gameover.html',
})
export class GameoverPage {
  @ViewChild("image") image:ElementRef;

  screenshot;
  score;
  width;
  height;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private admobFree: AdMobFree,
    private app: App) {
    this.screenshot = navParams.data.path;
    this.width = navParams.data.width;
    this.height = navParams.data.height;
    this.score = navParams.data.score;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameoverPage');
    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      isTesting: true,
      autoShow: true
     };
     this.admobFree.banner.config(bannerConfig);
     
     this.admobFree.banner.prepare()
       .then(() => {
         // banner Ad is ready
         // if we set autoShow to false, then we will need to call the show method here
       })
       .catch(e => console.log(e));
  }

  exit(){
    this.app.getRootNav().setRoot(HomePage);
  }

}
