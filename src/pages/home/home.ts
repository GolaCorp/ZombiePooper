import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { GameoverPage } from '../gameover/gameover'
import { LevelsPage } from '../levels/levels'

import Matter from 'matter-js';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild("gameCanvas") gameCanvas:ElementRef;


    Engine 
    Render
    RenderPixi
    World
    Bodies
    Body
    Constraint
    Vector
    Events
    Runner
    width
    height

    engine
    world
    render
    runner


    score = 0
    
    notRunning = true
    
    // variables
    shooter;
    shooter_level = 3;
    noCollisions = 0x0002;
    collisions = 0x0004;
    currentlevel;
    levels:Array<level> = [];

    
    fired = [];
    ghosts = [];
  constructor(public navCtrl: NavController,private navParam:NavParams,private storage: Storage) {
    this.Engine = Matter.Engine;
    this.Render = Matter.Render;
    this.World = Matter.World;
    this.Bodies = Matter.Bodies;
    this.Body = Matter.Body;
    this.Constraint = Matter.Constraint
    this.Vector = Matter.Vector;
    this.Events = Matter.Events;
    this.Runner = Matter.Runner;

    }

    ionViewWillEnter(){

        for(var i=0;i<10;i++){
            this.levels.push({
              id:i+1,
              isLock:false,
              game_level:1 + i*0.1,
              ghost_force: i < 3 ? 1 : (i < 6 ? 2 : 2),
              fire_force: i < 3 ? 1 : (i < 6 ? 2 : 2),
              ghost_speed: 1.5 + i*0.4*Math.random(),
              fire_speed: 2 + i*0.1,
              shooter_level: i < 3 ? 3 : (i < 5 ? 4 : (i < 8 ? 5 : 6)),
              target_score:1000 + i*250
            });
          }

        
            this.storage.get('currentlevel').then((val)=>{
                if(val){
                    this.currentlevel = val;
                    this.shooter_level = this.levels[this.currentlevel].shooter_level;
                }else{
                    this.shooter_level = 3;
                    this.currentlevel = 0;
                    this.storage.set('currentlevel', 0);
                }
                if(this.navParam.data.again){
                    this.init();
                }
            });

    }

    

    levelspage(){
        this.navCtrl.push(LevelsPage);
    }



    fire(level){
        for(var i=0;i<level*2;i++){
            this.fired.push(this.Bodies.circle(this.shooter.vertices[i].x,this.shooter.vertices[i].y,4, { 
                frictionAir: 0.0, 
                collisionFilter:{
                    mask:this.noCollisions | this.collisions
                },
                render:{
                    fillStyle:'red',
                    strokeStyle:'white',
                    lineWidth:'2px'
                }
            }));
            this.Body.setMass(this.fired[this.fired.length-1],1);

            var vel = this.Vector.sub(this.Vector.create(this.shooter.vertices[i].x,this.shooter.vertices[i].y),this.Vector.create(this.width/2,this.height/2));
            this.Body.setVelocity(this.fired[this.fired.length-1],this.Vector.div(vel,30/this.levels[this.currentlevel].fire_speed));
                this.World.add(this.world,this.fired[this.fired.length-1]);
        }
    }
    
    ghost(){
        for(var i=0;i<this.levels[this.currentlevel].game_level*2;i++){
            var x = this.width,y= this.height;
            if(Math.random() < 0.25){
                x = this.width + Math.random()*100;
                y = Math.random()*this.height;
            }else if(Math.random() < 0.5){
                x = -Math.random()*100;
                y = Math.random()*this.height;
            }else if(Math.random() < 0.75){
                y = -Math.random()*100;
                x = Math.random()*this.width;
            }else{
                y = this.height + Math.random()*100;
                x = Math.random()*this.width;
            }
            this.ghosts.push(this.Bodies.polygon(x,y,Math.floor(Math.random()*this.currentlevel*4) + 3 , 4*Math.random() + 9 - this.currentlevel*0.4 , { 
                frictionAir: 0.0, 
                label:'ghost',
                collisionFilter:{
                    category:this.collisions
                },
                render:{
                    fillStyle:'skyblue',
                    strokeStyle:'white'
                }
            }));
            var vel = this.Vector.sub(this.Vector.create(this.width/2,this.height/2),this.Vector.create(x,y));
            this.Body.setVelocity(this.ghosts[this.ghosts.length-1],this.Vector.div(vel,1000/this.levels[this.currentlevel].ghost_speed));
            
            this.World.add(this.world,this.ghosts[this.ghosts.length-1]);
        }
    }
    
    checkIsIn(){
        for(let i=this.fired.length-1;i>=0;i--){
            if(this.fired[i].position.x > this.width || this.fired[i].position.y > this.height 
                || this.fired[i].position.x < 0 || this.fired[i].position.y < 0){
                    this.fired.splice(i,1);
                }
            }
        
        for(let i=this.ghosts.length-1;i>=0;i--){
            if(this.ghosts[i].position.x > this.width + 100 || this.ghosts[i].position.y > this.height + 100 
                || this.ghosts[i].position.x < -100 || this.ghosts[i].position.y < -100){
                    this.ghosts.splice(i,1);
                    this.score += 50;
            }
        }

        if(this.score >= this.levels[this.currentlevel].target_score){
            this.storage.set('currentlevel', this.currentlevel+1);

            this.Render.stop(this.render);
            this.Runner.stop(this.runner);     
            this.runner.enabled = false;
            let currentIndex = this.navCtrl.getActive().index;
            this.navCtrl.push(GameoverPage,{image:this.render.canvas.toDataURL("image/jpeg")
                ,score:this.score,width:this.width,height:this.height, next:true}).then(()=>{
                    this.navCtrl.remove(currentIndex);
            });
        }
    }
            
        init(){
            this.notRunning = false;
            
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            
            this.engine = this.Engine.create();
            this.world = this.engine.world;
            
            this.render  = this.Render.create({
                element:this.gameCanvas.nativeElement,
                engine:this.engine,
                options:{
                    height:this.height,
                    width:this.width,
                    wireframes:false,
                    background:'#212529',
                    wireframeBackground:'#111111'
                }
            });
            
        this.world.gravity.y = 0;

        this.shooter = this.Bodies.polygon(this.width/2,this.height/2,this.shooter_level,20, {collisionFilter:{
            mask: this.noCollisions | this.collisions
        },
        render:{
            fillStyle:'white',
            strokeStyle:'white'
        }});
        this.Body.setMass(this.shooter,10000);
        this.World.add(this.world, [this.shooter]);

        this.Events.on(this.engine, "beforeUpdate", () =>{this.checkIsIn();});
        this.Events.on(this.engine, 'collisionStart', (event) => {
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if(pair.bodyA.label == "Polygon Body" || pair.bodyB.label == "Polygon Body"){
                    this.Render.stop(this.render);
                    this.Runner.stop(this.runner);     
                    this.runner.enabled = false;
                    let currentIndex = this.navCtrl.getActive().index;
                    this.navCtrl.push(GameoverPage,{image:this.render.canvas.toDataURL("image/jpeg")
                        ,score:this.score,width:this.width,height:this.height,next:false}).then(()=>{
                            this.navCtrl.remove(currentIndex);
                    });
                }
            }

        });
        
        setInterval(()=>{this.fire(this.shooter_level);},1000/this.levels[this.currentlevel].fire_force);
        setInterval(()=>{this.ghost();},3000/this.levels[this.currentlevel].ghost_force);
        


        this.keyTouchMouse();
        // this.Engine.run(this.engine);
        this.runner = this.Runner.run(this.engine);
        this.Render.run(this.render);
    }

    


    keyTouchMouse(){
        document.addEventListener('touchstart',(p)=>{
            var pos = p.touches[0];
            if(pos.screenX > this.width/2)
                this.shooter.angle += (0.008);
            else
                this.shooter.angle -= (0.008);
        });
    }

}
interface level{
    id:number;
    isLock:boolean;
    game_level:number;
    ghost_force:number;
    fire_force:number;
    ghost_speed:number;
    fire_speed:number;
    shooter_level:number;
    target_score:number;
  }