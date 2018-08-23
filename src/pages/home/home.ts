import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GameoverPage } from '../gameover/gameover'
import { Screenshot } from '@ionic-native/screenshot';

import Matter from 'matter-js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild("gameCanvas") gameCanvas:ElementRef;

    // canvas = document.getElementById("gameCanvas");

    Engine 
    Render
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
    shooter_level = 6;
    noCollisions = 0x0002;
    collisions = 0x0004;
    game_level = 1;
    ghost_force = 1;
    fire_force = 1;
    ghost_speed = 2;
    fire_speed = 2;
    
    
    fired = [];
    ghosts = [];
  constructor(public navCtrl: NavController,private screenshot: Screenshot) {
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

    ionViewDidLoad(){
        
    }



    fire(level){
        for(var i=0;i<level;i++){
            this.fired.push(this.Bodies.circle(this.shooter.vertices[i].x,this.shooter.vertices[i].y,4, { 
                frictionAir: 0.0, 
                collisionFilter:{
                    mask:this.noCollisions | this.collisions
                },
                render:{
                    fillStyle:'red',
                    strokeStyle:'red'
                }
            }));
            this.Body.setMass(this.fired[this.fired.length-1],1);

            var vel = this.Vector.sub(this.Vector.create(this.shooter.vertices[i].x,this.shooter.vertices[i].y),this.Vector.create(this.width/2,this.height/2));
            this.Body.setVelocity(this.fired[this.fired.length-1],this.Vector.div(vel,30/this.fire_speed));
                this.World.add(this.world,this.fired[this.fired.length-1]);
        }
    }
    
    ghost(){
        for(var i=0;i<this.game_level*2;i++){
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
            this.ghosts.push(this.Bodies.circle(x,y,7, { 
                frictionAir: 0.0, 
                collisionFilter:{
                    category:this.collisions
                },
                render:{
                    fillStyle:'blue',
                    strokeStyle:'blue'
                }
            }));
            var vel = this.Vector.sub(this.Vector.create(this.width/2,this.height/2),this.Vector.create(x,y));
            this.Body.setVelocity(this.ghosts[this.ghosts.length-1],this.Vector.div(vel,1000/this.ghost_speed));
            
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
                    wireframes:false
                }
            });
            
            this.world.gravity.y = 0;

        this.shooter = this.Bodies.polygon(this.width/2,this.height/2,this.shooter_level,20, {collisionFilter:{
            mask: this.noCollisions | this.collisions
        }});
        this.Body.setMass(this.shooter,10000);
        this.World.add(this.world, [this.shooter]);

        this.Events.on(this.engine, "beforeUpdate", () =>{this.checkIsIn();});
        this.Events.on(this.engine, 'collisionStart', (event) => {
            var pairs = event.pairs;
            console.log(event.pairs[0]);
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if(pair.bodyA.label == "Polygon Body" || pair.bodyB.label == "Polygon Body"){
                    this.Render.stop(this.render);
                    this.Runner.stop(this.runner);     
                    this.runner.enabled = false;
                    // this.screenshot.URI(40).then((img)=>{
                        this.navCtrl.push(GameoverPage,{score:this.score,width:this.width-100,height:this.height});
                    // });
                }
            }

        });
        
        setInterval(()=>{this.fire(this.shooter_level);},1000/this.fire_force);
        setInterval(()=>{this.ghost();},3000/this.ghost_force);
        


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
