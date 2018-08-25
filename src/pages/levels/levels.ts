import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home'
import { Storage } from '@ionic/storage';
/**
 * Generated class for the LevelsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-levels',
  templateUrl: 'levels.html',
})
export class LevelsPage {

  levels = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage) {
  }

  ionViewWillLoad(){
    this.storage.get('currentlevel').then((val)=>{
      for(var i=0;i<10;i++){
        if(i <= val){
          this.levels.push({
            id:i+1,
            isLock:false
          });
        }else{
          this.levels.push({
            id:i+1,
            isLock:true
          });
        }

      }
  });
  }

  play(level){
    // this.navCtrl.push(HomePage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LevelsPage');
  }

}


