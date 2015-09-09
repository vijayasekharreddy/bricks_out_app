$(document).ready(function(){
  var ctx = $('#myCanvas')[0].getContext("2d");            
  var x = 230;
  var y = 290;
  var dx = 2;
  var dy = 4;
  // var c = $('#myCanvas');
  ctx;
  var stop= false; 
  var paddlex;
  var paddleh;
  var paddlew;
  // var mouseMinX;
  // var mouseMaxX;
  var bricks;
  var NROWS = 10;
  var NCOLS = 20;
  var totalbricks;
  var BRICKWIDTH;
  var BRICKHEIGHT;
  var PADDING;
  var ballr = 5; 
  var bouncingSound = new Audio("/bounce.ogg");
  var breakingSound = new Audio("/break.ogg");

  //for paddle
  var paddle=ctx.createLinearGradient(0,100,200,0);
    paddle.addColorStop("0","magenta");
    paddle.addColorStop("0.5","blue");
    paddle.addColorStop("1.0","red");                  
    var paddleColor = paddle;
    var ballColor = "gold";
  
  //for bricks  
  var grd=ctx.createLinearGradient(100,0,100,150);
    grd.addColorStop(0,"#10161F");
    grd.addColorStop(0.7,"#8A9399");
    grd.addColorStop(1,"#464E51"); 

    var score=0;  
    var level = 1; 

    //giving proper canvas structure
    function init(){
      WIDTH = $('#myCanvas')[0].width;
      HEIGHT = $('#myCanvas')[0].height; 
      var intervalId;
     
      ctx.fillStyle=grd;
      ctx.fillRect(0,0,800,200);
      initbricks();
      
       draw();
    }

    function init_paddle(){
      paddlex = 400/2;
      paddleh = 10;
      paddlew = 75;
    }    

    function rect(x,y,w,h){        
      ctx.beginPath();        
      ctx.rect(x,y,w,h);
      ctx.closePath();
      ctx.fill();
    }    

    // for different keys
    leftDown = false;
    rightDown = false;

    $(document).keydown(function onKeyDown(evt){
        if(evt.keyCode == 39) rightDown = true;
        else if (evt.keyCode == 37) leftDown =true;
      });
    $(document).keyup(function onKeyUp(evt){
        if(evt.keyCode == 39) rightDown = false;
        else if(evt.keyCode == 37) leftDown =false;
      });

    // $(document).keydown(function onKeyDown(evt){
    //     if(evt.keyCode == 68) rightDown = true;
    //     else if (evt.keyCode == 65) leftDown =true;
    //   });
    // $(document).keyup(function onKeyUp(evt){
    //     if(evt.keyCode == 68) rightDown = false;
    //     else if(evt.keyCode == 65) leftDown =false;
    //   });

    // $(document).keydown(function onKeyDown(evt){
    //     if(evt.keyCode == 102) rightDown = true;
    //     else if (evt.keyCode == 100) leftDown =true;
    //   });
    // $(document).keyup(function onKeyUp(evt){
    //     if(evt.keyCode == 102) rightDown = false;
    //     else if(evt.keyCode == 100) leftDown =false;
    //   }); 
  
    // bricks
    function initbricks() {          
      totalbricks = NROWS*NCOLS;  
      BRICKWIDTH = (WIDTH/NCOLS) - 1;
      BRICKHEIGHT = 15;
      PADDING = 1;        
      bricks = new Array(NROWS);
      for (i=0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (j=0; j < NCOLS; j++) {
          bricks[i][j] = 1;          
        }
      }   
    } 


    //result of the game
    function gameOver(){
      var grd1=ctx.createRadialGradient(75,50,5,90,60,100);
        grd1.addColorStop(0,"red");
        grd1.addColorStop(1,"white");

        ctx.font = "50px Arial";
        ctx.fillStyle = grd1;
        ctx.fillText("Game Over!",100,150);            
        clearInterval(intervalId);
    }
     
    //code for buttons
    $('#startGame').on("click", function newGame(){
      intervalId = setInterval(bricksout, 30);
      $('#startGame').hide();
      $('#stop').show();
    });
   
    $('#play').click( function playGame() {
      stop = false;
      intervalId = setInterval(bricksout, 30);
      $('#play').hide();
      $('#stop').show();
    });

    $('#stop').click( function pauseGame() {
      stop = true;
      //stop();
      intervalId = clearInterval(intervalId);
      $('#stop').hide();
      $('#play').show()
    });  


    //To play the game                            
    function draw(){
      // ctx.fillStyle = backColor;
      ctx.clearRect(0,0,800,300);
      ctx.fillStyle = ballColor;
      ctx.beginPath();        
      ctx.arc(x, y, ballr, 0, Math.PI*2, true);                 
      ctx.closePath();
      ctx.fill(); 
      if(rightDown) paddlex += 5;
      else if(leftDown) paddlex -= 5;
      ctx.fillStyle = paddleColor;
      rect(paddlex, 300-paddleh, paddlew, paddleh);
        

      //draw bricks
      for (i=0; i < NROWS; i++) {
        for (j=0; j < NCOLS; j++) {
          if (bricks[i][j] == 1) {  
            ctx.font = "50px Arial";              
            ctx.fillStyle = grd;
            ctx.fillText("NBOS TECHNOLOGIES!",130,150);                       
            rect((j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING, BRICKWIDTH, BRICKHEIGHT);                           
          }                
        }
      }      
    }

     function bricksout(){
      draw();
      var rowheight = BRICKHEIGHT + PADDING;
      var colwidth = BRICKWIDTH + PADDING;
      var row = Math.floor(y/rowheight);
      var col = Math.floor(x/colwidth);

      //if so, reverse the ball and mark the brick as broken
      if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {          
        dy = -dy;                      
        bricks[row][col] = 0;  
        totalbricks = totalbricks-1;       
        score += 2;
        $('.score').text(score);
        breakingSound.play();
      }  
           
      if(totalbricks == 0){                               
        //gameOver();
        level += 1;        
        NROWS = Math.floor((Math.random() * 10) + level);
        initbricks();
        $('.level').text(level);
                                
      }  
      if(x + dx + ballr > 800 || x + dx - ballr < 0)          
        dx = -dx;   
              
      if(y + dy - ballr < 0)
        dy = -dy;          
        else if(y + dy + ballr > 300 - paddleh){
          if(x > paddlex  && x < paddlex + paddlew){
            dx =8 * ((x - (paddlex+paddlew/2))/paddlew);
            dy = -dy; 
            bouncingSound.play();       
          }           
          else if(y + dy + ballr > 300)  {          
            clearInterval(intervalId); 
            alert("lose the game");  
            location.reload();
            }                                                                            
        }            
        x += dx;
        y += dy;
    }    
    init_paddle();   
    init();        
});


      