var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var PLAY = 1
var END = 0;
var score = 0;

var gameState = PLAY;

function preload(){
    bgImg = loadImage("assets/bg.png")
    restartImg = loadImage("assets/restart.png");
    bottom1Img = loadImage("assets/obsBottom1.png");
    bottom2Img = loadImage("assets/obsBottom2.png");
    bottom3Img = loadImage("assets/obsBottom3.png");
    balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png")
    top1Img = loadImage("assets/obsTop1.png");
    top2Img = loadImage("assets/obsTop2.png");
    gameOverImg = loadImage("assets/gameOver.png");
    restartImg = loadImage("assets/restart.png");
    Nightbg = loadImage("assets/bg_night.jpg");
   
}

function setup(){
createCanvas(600,400);
//background image
    bg = createSprite(165,485,1,1);
    //bg.addImage(bgImg);
    
    getBackgroundImg();
    

    //creating top and bottom grounds
    bottomGround = createSprite(200,390,800,20);
    bottomGround.visible = false;

    topGround = createSprite(200,10,800,20);
    topGround.visible = false;
          
    //creating balloon     
    balloon = createSprite(100,200,20,50);
    balloon.addAnimation("balloon",balloonImg);
    balloon.scale = 0.15;

    //create bottom buildings
    gameOver = createSprite(220,200);
    restart = createSprite(220,240);
    gameOver.addImage(gameOverImg);
    restart.addImage(restartImg);
    gameOver.scale = 0.5;
    restart.scale = 0.5;

  topObstacleGroup = new Group();
  bottomObstacleGroup = new Group();
  barGroup = new Group();

  balloon.debug = false;

}

function draw() {
  
  background("black");

  if(gameState === PLAY){
       //making the hot air balloon jump
    if(keyDown("space")) {
      balloon.velocityY = -6 ;
      
            
    }
    gameOver.visible = false;
    restart.visible = false;

          //adding gravity
    balloon.velocityY = balloon.velocityY + 2;
    spawnObstacleTop();
    spawnObstacleBottom();
    if(topObstacleGroup.isTouching(balloon) || bottomObstacleGroup.isTouching(balloon) || balloon.isTouching(topGround) || balloon.isTouching(bottomGround)){
      gameState = END;
    }
  }
  if(gameState === END){
    balloon.velocityX = 0;
    balloon.velocityY = 0;
    bottomObstacleGroup.setVelocityXEach(0);
    topObstacleGroup.setVelocityXEach(0);
    balloon.y = 200;
    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)){
      reset();
    }
  }

          
        drawSprites();

    textSize(30);
    text("score: " + score,250,50);

    score1(); 
    bar();   
}


function spawnObstacleTop(){
  if(World.frameCount % 80 === 0){
    var obstacleTop = createSprite(400,50,40,50);
    //obstacleTop.addImage(top1Img);
    obstacleTop.scale = 0.08;
    obstacleTop.velocityX = -4
    obstacleTop.y = Math.round(random(10,200));

    var rand = Math.round(random(1,2));
    switch(rand){
      case 1:obstacleTop.addImage(top1Img);
      break;
      case 2:obstacleTop.addImage(top2Img);
      break;
      default:
      break;
    }
    obstacleTop.lifetime = 100;
    topObstacleGroup.add(obstacleTop);
  }


}

function spawnObstacleBottom(){
  if(World.frameCount % 60 === 0){
    var obstacleBottom = createSprite(400,350,40,50);
    obstacleBottom.debug = false;
    //obstacleBottom.addImage(top1Img);
    obstacleBottom.scale = 0.05;
    obstacleBottom.velocityX = -4
  // obstacleBottom.y = Math.round(random(220,350));
    

    var rand = Math.round(random(1,3));
    switch(rand){
      case 1:obstacleBottom.addImage(bottom1Img);
      break;
      case 2:obstacleBottom.addImage(bottom2Img);
      break;
      case 3: obstacleBottom.addImage(bottom3Img);
      break;
      default:
      break;

    }
    obstacleBottom.lifetime = 100;
    bottomObstacleGroup.add(obstacleBottom);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  topObstacleGroup.destroyEach();
  topObstacleGroup.destroyEach();
  score = 0;
}


function bar(){
  if(World.frameCount % 60 === 0 ){
    var bar = createSprite(400,200,10,800);
    bar.velocityX = -6;
    bar.shapeColor = "red"
    bar.depth = balloon.depth;
    bar.lifetime = 70;
    bar.visible = false;
    barGroup.add(bar);
  }
} 
  function score1(){
    if(balloon.isTouching(barGroup)){
      score = score + 5;
    }

  }
  async function getBackgroundImg(){
    var response = await fetch("http://worldtimeapi.org/api/timezone/Europe/London");
    var responseJSON = await response.json();
    var datetime = responseJSON.datetime;
    var hour = datetime.slice(11,13);
    if(hour>=15 && hour<=16){
      bg.addImage(bgImg);
      bg.scale = 1.3
    }
    else{
      bg.addImage(Nightbg);
      bg.x = 200
      bg.y = 200
    }
  }