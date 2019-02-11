  let video;
  let poseNet;
  let poses = [];
  let skeletons = [];
  let cnvHeight = 600;
  let cnvWidth = 900;
  let windowW=window.innerWidth;
  let windowH=window.innerHeight;
  var cnv;
  var startButton;
  var started = false;

  var mainImg;
  var enemiesImg;
  var boybackimg;
  var girlInLoveimg;
  var boybackimg;
  var bimg;

  let mode;

  var width = 400;

  let start = false;
  let p5Sketch;

  let widthCharacters=70;
  let heightCharacters=70;

  let x;

  //Invaders 
    let invaders = [];
 let heart = [];
 let projectiles = [];
 let width_y = 400;
 let length_y = 400;
 let invaderSize = 70;
 let pSize = 10;
 let heartSize = 10;
 let xPos = 80;
 let yPos = 75;
 let xIncrement = 10;
 let yIncrement = 10;
 let lifeCount = 3;
 let isPewPew;
 var num;
 var cX;
 var cY = cnvHeight-100;
 var cSize = 70;
 var k = 0;
 var rank = 10;
 var difficulty = 1;
 var speedRatio = 15

 var refusalImg;
 var heartImg;

  function preload(){
      bimg = loadImage('images/heart_background.jpg');
      girlbackimg=loadImage('images/rabbit_girl_back.png');
      girlInLoveimg=loadImage('images/rabbit_girl_in_love.png');
      boybackimg =loadImage('images/fox_boy_back.png');
      boyInLoveimg=loadImage('images/fox_boy_in_love.png');
      refusalImg=loadImage('images/refusal.png');
      heartImg=loadImage('images/heart.png');
  }

function setup() {
  
  cnv=createCanvas(cnvWidth, cnvHeight);
  cnv.position(500,200);
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function (results) {
    poses = results;
  });
  video.hide();
  

}

class MovingEnemy {
  // let x =400;
   constructor(i, j) {
     this.visible = true;
     this.x = xPos + (xIncrement + invaderSize) * i;
    //  console.log(this.x);
     this.y = yPos + (yIncrement + invaderSize) * j;
     this.diameter = invaderSize;//we will not need
     this.speed = difficulty * speedRatio;
   }

   move() {
    //  this.x = this.x;
     if (frameCount % 40 == 0) {
       this.y += this.speed;
     }
   }

   display() {
     if (this.visible) {
      //  if (frameCount % 150 == 0) {
          if(mode==0){
            // console.log("display mode=0");
            image(girlInLoveimg, this.x,this.y,widthCharacters, heightCharacters);
            // console.log(this.x);
            // ellipse(this.x, this.y, this.diameter, this.diameter);
          }
          else if(mode==1){
            image(boyInLoveimg,  this.x,this.y,widthCharacters,heightCharacters);
          }
          else if(mode==2){
            image(girlInLoveimg,  this.x,this.y,widthCharacters,heightCharacters);
          }
          else if(mode==3){
            image(boyInLoveimg,  this.x,this.y,widthCharacters,heightCharacters);
          }//output the image
      //  }
     }
   }

   destroy(k) {
     if (this.visible) {
       for (i = 0; i < projectiles.length; i++) {
         if (dist(this.x, this.y, projectiles[i].x, projectiles[i].y) <= (invaderSize + pSize) / 2) {
           projectiles.shift();
           //numArray = numArray.splice(numArray.indexOf(k),1);
           invaders[k].visible = false;
         }
       }
     }
   }
 }

function modelReady() {
  // select('#status').html('Model Loaded');
}

function draw() {
  // console.log("in draw");
  //if start
  if(start){
    drawVideo();
    // image(bimg);
    // drawVideo();
    background(255, 192, 203);
    drawCharacters();
    //drawing the enemies
    // if(frameCount % 60 == 0){
      console.log(invaders.length);
      for (i in invaders) {
         console.log(i);
          invaders[i].move();//move method gives you the x and y pos of enemies 
          // invaders[i].destroy(i);
          invaders[i].display();
          invaders[i].destroy(i);
      }

      //projectiles of main character
      for(j in projectiles){
        projectiles[j].show();//
        projectiles[j].move();
      }

      //generates the projectiles from enemies randomly 
   if (frameCount % 30 == 0) {
     num = Math.floor(Math.random() * rank*(1+difficulty))
     heart.push(new PewPew(num));
   }

   //animation of trajectory of enemy projectiles
   for (i = 0; i < (heart.length); i++) {
     heart[i].move();//pos x y 
     if(isPewPew){
       heart[i].show();
     	 heart[i].hit();
        if(heart.length !=0){
          heart[i].delete();
        }
        if(lifeCount == 0){
          noLoop();
        }
      //  heart[i].delete();
     }
    //  heart[i].delete();

    }
}
}


 function PewPew(i) {
   var pewX = 0;
   var pewY = 0;
   if(invaders[i].visible){
   	pewX = invaders[i].x;
   	pewY = invaders[i].y;
     isPewPew = true;
   }
  
   this.show = function() {
     //fill(50,0,200);
      //  ellipse(pewX, pewY, heartSize, heartSize);
      image(heartImg, pewX, pewY,widthCharacters/2,heightCharacters/2);
   }

   this.move = function() {
     pewY = pewY + 2;
   }

   this.delete = function() {
     if (pewY >= cnvHeight) {
       heart.shift();
     }
   }

   //the main took a hit 
   this.hit = function() {
     	 if(pewX == -10 && pewY == length){
         return lifeCount;
       }else{
       let d = dist(cX, cY, pewX, pewY);
       if (d <= (cSize + heartSize) / 2) {
         heart.shift();
         console.log(lifeCount);
         return lifeCount--;
       }
       }
     }
 }

function Shoot(a, b) {
   this.x = a;
   this.y = b;

   this.show = function() {
     //noStroke(); 
     //fill(150,0,255);
    image(refusalImg,  this.x,this.y,widthCharacters/2,heightCharacters/2);
   }

   this.move = function() {
     this.y = this.y - 3;
   }
}

function keyPressed() {
   if (key === ' ') {
     var projectile = new Shoot(cX, cY);
     projectiles.push(projectile);
   }
}


function centerCanvas() {
    var x = (windowW - cnvWidth) / 2;
    var y = (windowH - cnvHeight) / 2;
    cnv.position(x, y);
}
function windowResized() {
  centerCanvas();
}

function drawVideo(){
  //takes care of the mirrored part
  // image(video, 0, 0, width/2, height); //video on canvas, position, dimensions
  translate(width,0); // move to far corner
  scale(-1.0,1.0);    // flip x-axis backwards
  image(video, 0, 0, width, height); //video on canvas, position, dimensions
}

function startDraw(){
  console.log("in startDraw");
  p5Sketch = new p5(draw, 'p5sketch');
  start = true;
  // draw();
}

function drawCharacters(){
  if(poses.length != 0){
    let keypoint = poses[0].pose.keypoints[0];
    cX = keypoint.position.x - 100;
    if (keypoint.score > 0.2) {
      // fill(255, 0, 0);
      // noStroke();
      // ellipse(keypoint.position.x, cnvHeight-300, 10, 10);
      // image(boybackimg, keypoint.position.x - 150, cnvHeight-120);
      if(mode==0){
        // console.log("mode=0");
        image(boybackimg, keypoint.position.x - 100, cnvHeight-100,widthCharacters, heightCharacters);
      }
      else if(mode==1){
        image(girlbackimg, keypoint.position.x - 100, cnvHeight-100,widthCharacters,heightCharacters);
      }
      else if(mode==2){
        image(girlbackimg, keypoint.position.x - 100, cnvHeight-100,widthCharacters,heightCharacters);
      }
      else if(mode==3){
        image(boybackimg, keypoint.position.x - 100, cnvHeight-100,widthCharacters,heightCharacters);
      }

    //call function to draw invaders 

    }
  }
  else{
    //output: Please open your camera!
  }

}

function boyGirl(){
  console.log("in boyGirl");
  mode=0;
  //fills the rray of ennemies
   for (i = 0; i < rank; i++) {
     for (j = 0; j <= difficulty; j++) {
       invaders.push(new MovingEnemy(i, j));
       k++;
     }
   }
}
function girlBoy(){
  mode=1;
  //fills the rray of ennemies
   for (i = 0; i < rank; i++) {
     for (j = 0; j <= difficulty; j++) {
       invaders.push(new MovingEnemy(i, j));
       k++;
     }
   }
}
function girlGirl(){
  mode=2;
  //fills the rray of ennemies
   for (i = 0; i < rank; i++) {
     for (j = 0; j <= difficulty; j++) {
       invaders.push(new MovingEnemy(i, j));
       k++;
     }
   }
}
function boyBoy(){
  mode=3;
  //fills the rray of ennemies
   for (i = 0; i < rank; i++) {
     for (j = 0; j <= difficulty; j++) {
       invaders.push(new MovingEnemy(i, j));
       k++;
     }
   }
}
