


let blockA;
let blockB;
let ground;
let width = window.innerWidth;
let height = window.innerHeight;

function setup() {
  createCanvas(width, height);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // create two boxes and a ground
  blockA = new Block(world, { x: 200, y: 200, w: 80, h: 80, color: 'white' });
  blockB = new Block(world, { x: 270, y: 50, w: 160, h: 80, color: 'white' });
    ground = new Block(world, { x: width / 2-50, y: height+5, w: width+100, h: 10, color: 'white' }, { isStatic: true});
    roof = new Block(world, { x: width / 2-50, y: 0, w: width+100, h: 10, color: 'white' }, { isStatic: true});

  // run the engine
  Matter.Runner.run(engine);
}




let speed = 0.02;

function draw() {
  background('black');
  blockA.draw();
  blockB.draw();
  ground.draw();

//   if left is being pressed apply force to blockA in the left direction
    playerControler(blockA);
    
    // wrap the blockA around the screen
    wrap(blockA);
    wrap(blockB);


    


    

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
    

}


wrap = function(prop) {
    if (prop.body.position.x > width) {
        Matter.Body.setPosition( prop.body,{x:0, y:prop.body.position.y});
    }
    if (prop.body.position.x < 0) {
        Matter.Body.setPosition( prop.body,{x:width, y:prop.body.position.y});
    }
    if (prop.body.position.y > height) {
        Matter.Body.setPosition( prop.body,{x:prop.body.position.x, y:0});
    }
    if (prop.body.position.y < 0) {
        Matter.Body.setPosition( prop.body,{x:prop.body.position.x, y:height});
    }
}