import { Component,ViewChild,ElementRef } from '@angular/core';
import {  NavController, NavParams,App } from 'ionic-angular';
import { HomePage } from '../home/home'
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-gameover',
  templateUrl: 'gameover.html',
})
export class GameoverPage {
  @ViewChild("imageover") image:ElementRef;

  screenshot;
  score;
  width;
  height;
  level;
  gonext;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private admobFree: AdMobFree,
    private storage: Storage,
    private app: App) {
    }
    
    ionViewWillEnter(){
      this.height = this.navParams.data.height-120;

      this.width = this.navParams.data.width-30;
      this.score = this.navParams.data.score;
      this.level = this.navParams.data.level;
      this.screenshot = this.navParams.data.image;
      this.gonext = this.navParams.data.next;
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

  tryAgain(){
    let currentIndex = this.navCtrl.getActive().index;
    this.navCtrl.push(HomePage,{again:true}).then(() => {
      this.navCtrl.remove(currentIndex);
    });
  }

  nextLevel(){
    let currentIndex = this.navCtrl.getActive().index;
    this.navCtrl.push(HomePage,{again:true}).then(() => {
      this.navCtrl.remove(currentIndex);
    });
  }

  exit(){
    this.app.getRootNav().setRoot(HomePage);
  }

}
