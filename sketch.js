const { Engine, Render, World, Bodies, Body, Runner, Events } = Matter;


let blockA;
let blockB;
let ground;
let width = 1920;
let height = 936;
let verticle_divider
let horizontal_divider 

// create a portal network that teleports blockA to blockB and vice versa
let portalNetwork1

let portalNetwork2

let engine

let world


let  metector


let portalPos_1right = { x: (width / 2)-16, y: height / 4, w: 16, h: 200}

let portalPos_2right = { x: width-8, y: height / 4, w: 16, h: 200}

let portalPos_3right = { x: (width / 2)-16, y: (height / 4)*3, w: 16, h: 200}

let portalPos_4right = { x: width-8 , y: (height / 4)*3, w: 16, h: 200}

let portalPos_1left = { x: 0+16, y: height / 4, w: 16, h: 200}

let portalPos_2left = { x: width/2+16, y: height / 4, w: 16, h: 200}

let portalPos_3left = { x: 0+16, y: (height / 4)*3, w: 16, h: 200}

let portalPos_4left = { x: (width / 2)+16, y: (height/4)*3, w: 16, h: 200}

let portalPos_1top = { x: width / 4, y: 0+8, w: 200, h: 16}

let portalPos_2top = { x: (width / 4)*3, y: 0+8, w: 200, h: 16}

let portalPos_3top = { x: width / 4, y: (height/2)+16, w: 200, h: 16}

let portalPos_4top = { x: (width / 4)*3, y: (height/2)+16, w: 200, h: 16}

let portalPos_1bottom = { x: width / 4, y: height/2-16, w: 200, h: 16}

let portalPos_2bottom = { x: (width / 4)*3, y: height/2-16, w: 200, h: 16}

let portalPos_3bottom = { x: width / 4, y: height-8, w: 200, h: 16}

let portalPos_4bottom = { x: (width / 4)*3, y: height-8, w: 200, h: 16}




spacing = 90;




//class definition portal network 


function setup() {
  createCanvas(width, height);

  // create an engine
  engine = Matter.Engine.create();
  world = engine.world;

  // create two boxes and a ground
  blockA = new Block(world, { x: 200, y: 200, w: 80, h: 80, color: 'white' });
    ground = new Block(world, { x: width / 2-50, y: height+5, w: width+100, h: 10, color: 'white' }, { isStatic: true});
    roof = new Block(world, { x: width / 2-50, y: 0, w: width+100, h: 10, color: 'white' }, { isStatic: true});

    left = new Block(world, { x: 0, y: height / 2, w: 10, h: height, color: 'white' }, { isStatic: true});
    right = new Block(world, { x: width, y: height / 2, w: 10, h: height, color: 'white' }, { isStatic: true});

  // divide the screen into 4 equal parts using 2 blocks
  verticle_divider = new Block(world, { x: width / 2, y: height / 2, w: 16, h: height, color: 'white' }, { isStatic: true});
    horizontal_divider = new Block(world, { x: width / 2, y: height / 2, w: width, h: 16, color: 'white' }, { isStatic: true});
    
    // create a portal network that teleports blockA to blockB and vice versa 
    
    portalNetwork1 = new PortalNetwork(portalPos_1top, portalPos_2bottom, 0, world, "red", {x: 0, y: -spacing}, {x: 0, y: spacing});

    portalNetwork2 = new PortalNetwork(portalPos_4right, portalPos_2right, 2, world, "blue", {x: -spacing, y: 0}, {x: -spacing, y: 0});


    portals = portalNetwork1.returnBlocks();


    
        
  // run the engine
  Matter.Runner.run(engine);
}






let speed = 0.015;

function draw() {
  background('black');
  blockA.draw();
  ground.draw();

//   if left is being pressed apply force to blockA in the left direction
    playerControler(blockA);
    
    // wrap the blockA around the screen
    verticle_divider.draw();
    horizontal_divider.draw();

    
    // for block in portal network return blocks draw them
    for (let block of portalNetwork1.returnBlocks()) {
        block.draw();
    }

    for (let block of portalNetwork2.returnBlocks()) {
        block.draw();
    }
    

    portalNetwork1.collisionsHandler(blockA);

    portalNetwork2.collisionsHandler(blockA);


}

playerControler = function(prop) {
    if (keyIsDown(LEFT_ARROW)) {
        Matter.Body.applyForce(prop.body, prop.body.position, {x: -speed, y: 0});
        }

    // if right is being pressed apply force to prop in the right direction
    if (keyIsDown(RIGHT_ARROW)) {
        Matter.Body.applyForce(prop.body, prop.body.position, {x: speed, y: 0});
        }

    // if up is being pressed apply force to prop in the up direction
    if (keyIsDown(UP_ARROW)) {
        Matter.Body.applyForce(prop.body, prop.body.position, {x: 0, y: -speed});
        }

    // if down is being pressed apply force to prop in the down direction
    if (keyIsDown(DOWN_ARROW)) {
        Matter.Body.applyForce(prop.body, prop.body.position, {x: 0, y: speed});
        }
    

    // if the key being pressed is r then do something



}
class PortalNetwork {
    // portal networks have 2 blocks that when touched, teleport the other block to the other side of the portal
    constructor(info1, info2, changeMomentum, world, color, offset1, offset2) {
        info1["color"] = color;
        info2["color"] = color;
        this.block1 = new Block(world, info1, {isStatic: true, isSensor: true});
        this.block2 = new Block(world, info2, {isStatic: true, isSensor: true});
        this.changeMomentum = changeMomentum;

        this.offset1 = offset1;
        this.offset2 = offset2;
    }

    // make a fuction use portal that takes in a block and checks when it touches the portal and then teleports it to the other side of the portal


    returnBlocks() {
        return [this.block1, this.block2];
    }


    collisionsHandler(blockA) {
        let box1Collide = Matter.SAT.collides(blockA.body, this.block1.body);
    let box2Collide = Matter.SAT.collides(blockA.body, this.block2.body);
    
    // if box 1 collide is not null run something
    if (box1Collide) {
        // if box1collide.collided is true then run something
        if (box1Collide.collided) {
            // if the changeMomentum is false then run something
            // change the angle of the velocity of blockA by changeMomentum
            let currentVelocity = blockA.body.velocity;
            if (this.changeMomentum === 1) {
                Matter.Body.setVelocity(blockA.body, {x: currentVelocity.y, y: currentVelocity.x});
            } else if (this.changeMomentum === 2) {
                Matter.Body.setVelocity(blockA.body, {x: -currentVelocity.x, y: -currentVelocity.y});
            } else if (this.changeMomentum === 3) {
                Matter.Body.setVelocity(blockA.body, {x: -currentVelocity.y, y: -currentVelocity.x});
            }
            console.log(this.offset1)
            Matter.Body.setPosition(blockA.body, {x: this.block2.body.position.x + this.offset1["x"] , y: this.block2.body.position.y + this.offset1["y"]});
        }
    }

    // if box 2 collide is not null run something
    if (box2Collide) {
        // if box2collide.collided is true then run something
        if (box2Collide.collided) {
            let currentVelocity = blockA.body.velocity;
            // if the changeMomentum is false then run something
            if (this.changeMomentum === 1) {
                Matter.Body.setVelocity(blockA.body, {x: currentVelocity.y, y: currentVelocity.x});
            } else if (this.changeMomentum === 2) {
                Matter.Body.setVelocity(blockA.body, {x: -currentVelocity.x, y: -currentVelocity.y});
            } else if (this.changeMomentum === 3) {
                Matter.Body.setVelocity(blockA.body, {x: -currentVelocity.y, y: -currentVelocity.x});
            }
            // using Matter.Body.setPosition change the position of blockA to block2 in portal network
            Matter.Body.setPosition(blockA.body, {x: this.block1.body.position.x + this.offset2["x"]  , y: this.block1.body.position.y + this.offset2["y"]});

        }
    }

    }
    // print to console if the block that is passed in is touching the portal

}


document.documentElement.style.overflow = 'hidden';  // firefox, chrome