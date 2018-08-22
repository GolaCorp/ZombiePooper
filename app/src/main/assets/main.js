var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint
    Vector = Matter.Vector,
    Events = Matter.Events;

var width = window.innerWidth;
var height = window.innerHeight;

var engine = Engine.create();
var world = engine.world;
var render = Render.create({
    element:document.body,
    engine:engine,
    options:{
        height:height,
        width:width,
        wireframes:false
    }
});


// variables
var shooter;
var shooter_level = 3;
var noCollisions = 0x0002;
var collisions = 0x0004;
var print = console.log;
var game_level = 1;
var ghost_speed = 1;

init();

var fired = [];
var ghosts = [];

function fire(level){
    for(var i=0;i<level;i++){
        fired.push(Bodies.circle(shooter.vertices[i].x,shooter.vertices[i].y,4, { 
            frictionAir: 0.0, 
            collisionFilter:{
                mask:noCollisions | collisions
            },
            render:{
                fillStyle:'red',
                strokeStyle:'red'
            }
        }));
        var vel = Vector.sub(Vector.create(shooter.vertices[i].x,shooter.vertices[i].y),Vector.create(width/2,height/2));
        Body.setVelocity(fired[fired.length-1],Vector.div(vel,10));
        World.add(world,fired[fired.length-1]);
    }
}

function ghost(){
    for(var i=0;i<game_level*2;i++){
        var x = width,y= height;
        if(Math.random() < 0.25){
            x = width + Math.random()*100;
            y = Math.random()*height;
        }else if(Math.random() < 0.5){
            x = -Math.random()*100;
            y = Math.random()*height;
        }else if(Math.random() < 0.75){
            y = -Math.random()*100;
            x = Math.random()*width;
        }else{
            y = height + Math.random()*100;
            x = Math.random()*width;
        }
        ghosts.push(Bodies.circle(x,y,7, { 
            frictionAir: 0.0, 
            collisionFilter:{
                category:collisions
            },
            render:{
                fillStyle:'blue',
                strokeStyle:'blue'
            }
        }));
        var vel = Vector.sub(Vector.create(width/2,height/2),Vector.create(x,y));
        Body.setVelocity(ghosts[ghosts.length-1],Vector.div(vel,1000));

        World.add(world,ghosts[ghosts.length-1]);
    }
}

function checkIsIn(){
    for(let i=fired.length-1;i>=0;i--){
        if(fired[i].position.x > width || fired[i].position.y > height 
            || fired[i].position.x < 0 || fired[i].position.y < 0){
                fired.splice(i,1);
        }
    }

    for(let i=ghosts.length-1;i>=0;i--){
        if(ghosts[i].position.x > width || ghosts[i].position.y > height 
            || ghosts[i].position.x < 0 || ghosts[i].position.y < 0){
                ghosts.splice(i,1);
        }
    }
}

function init(){
    world.gravity.y = 0;

    shooter = Bodies.polygon(width/2,height/2,shooter_level,20, {collisionFilter:{
        mask: noCollisions
    }});
    World.add(world, [shooter]);

    Events.on(engine, "beforeUpdate", () =>{checkIsIn();});
    setInterval(()=>{fire(shooter_level);},1000);
    setInterval(()=>{ghost();},3000/ghost_speed);
    
    keyTouchMouse();
    Engine.run(engine);
    Render.run(render);
}

function keyTouchMouse(){
    document.addEventListener('touchstart',(p)=>{
        var pos = p.touches[0];
        if(pos.screenX > width/2)
            shooter.angle += (0.008);
        else
            shooter.angle -= (0.008);
    });
}