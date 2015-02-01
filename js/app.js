// Enemies our player must avoid
var Enemy = function(sX, sY, sP) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	//Image of the Enemy to load
	this.sprite = 'images/enemy-bug.png';
	//Possition where enemy start
	this.x = sX * 101;
	this.y = (sY * 83) - (83 / 3);
	// Seed of the enemy
	this.speed = sP;
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	// Move enemy
	if ((this.x + dt * this.speed) < 505) {
		this.x = this.x + dt * this.speed;
	} else {// If enemy is out of the screen, mmove to the beginning 
		this.x = -101;
	}

};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Star= function(){
	//load image star
	this.sprite = 'images/Star.png';

	//Possition where the star will appear start
	//coordinate Y--> min= 1/max=5
	//coordinate X--> min= 0/max=4
	this.x = RandomBetween2Integers(0,4) * 101;
	this.y = (RandomBetween2Integers(1,5) * 83) - (83 / 3);

	//Time millisecons min=5000/ max=15000



	this.timeToAppear=Date.now()+RandomBetween2Integers(5000,30000);
	//the player has 3 seconds to take the star
	this.timeVisible=this.timeToAppear+3000;
	this.visible=false;

	//Score of the star
	this.score=500;
};

Star.prototype.update=function(){
	       
if (!this.visible && (Date.now() > this.timeToAppear)) {
        this.visible = true;
    }
if (this.visible && (Date.now() > this.timeVisible)){
this.newSet();
}
  
};

Star.prototype.render = function() {
    if (this.visible) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}
Star.prototype.newSet= function(){
	//new time to appear
	this.timeToAppear=Date.now()+RandomBetween2Integers(5000,15000);
	this.timeVisible=this.timeToAppear+3000;

	//new possition
	this.x = RandomBetween2Integers(0,4) * 101;
	this.y = (RandomBetween2Integers(1,5) * 83) - (83 / 3);
	this.visible=false;
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sX, sY) {
	// Load image player
	this.sprite = 'images/char-horn-girl.png';
	// start possition of the player
	this.x = sX * 101;
	this.y = (sY * 83) - (83 / 3);
	// Score and lives of the player
	this.score = 0;
	this.lifes = 5;
};

Player.prototype.update = function() {
	// Detecting collision 
	var Px = this.x;
	var Py = this.y.toFixed(0);
	var Pw = parseFloat(Resources.get(this.sprite).width);
	var PxVision = +Px.toFixed(0) + (+Pw / 6);
	var Px2Vision = +Px + +Pw - (+Pw / 3);
	// Check collision with all the enemies
	for (enemy in allEnemies) {
		if (collision(Py, PxVision, Px2Vision, allEnemies[enemy])) {
			if ((this.lifes - 1) == -1) {
				// If no lives, restart game
				// Frozen game, wait user input
				ResetGame();
			} else {
				// If collision remove one life
				this.lifes -= 1;
				//console.log('Lives left ' + this.lives);
				this.x = 2 * 101;
				this.y = (5 * 83) - (83 / 3);
			}
		}

	}
	// collision star
	if(star.visible){
		if (collision(Py, PxVision, Px2Vision, star)){
			this.score=this.score+star.score;
			star.newSet();
		}
	}
	
	//Refresh score and lives in index
	var refreshLifes="Lifes : "+this.lifes;
	var refreshScore="Score : "+this.score;

	document.getElementById('game_lives').innerHTML = refreshLifes;
	document.getElementById('game_score').innerHTML = refreshScore;


};
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function(keyInput) {
	switch (keyInput) {
	case 'left':
		if ((this.x - 101) >= 0){
			this.x = this.x - 101;}
		break;
	case 'right':
		if ((this.x + 101) < 505){
			this.x = this.x + 101;}
		break;
	case 'up':
		if ((this.y - 83) >= 0){
			this.y = this.y - 83;}
		else {
			this.y = (5 * 83) - (83 / 3);
			this.score += 100;
		}
		break;
	case 'down':
		if ((this.y + 83) <= (606 - 166)){
			this.y = this.y + 83;}
		break;
	default:
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [ new Enemy(0, 3, 50), new Enemy(0, 1, 70), ];
var player = new Player(2, 5);
var star=new Star();
var bestRecord=0;

// Function to check collision of player with object
function collision(PY, PX, PX2, Object) {
	var OX = Object.x.toFixed(0);
	var OY = Object.y.toFixed(0);
	var OW = parseFloat(Resources.get(Object.sprite).width);
	var OX2 = +OX + +OW;
	if (OY == PY && (PX <= OX2) && (OX <= PX2)) {
		console.log('COLLISION!!');
		return true;
	}
	return false;
}
//fucntion return a random integer between 2 bounds
function RandomBetween2Integers(min,max){
return  randInt = (Math.floor(Math.random() * (max - min + 1)) + min);

}

//Function that restart the game
function ResetGame() {
//Refresh best record label
	if (player.score>bestRecord){
		var refreshRecord="Best Record : " +player.score;
		document.getElementById('record').innerHTML = refreshRecord;
		bestRecord=player.score;
}
//Restart enemies and player
	allEnemies = [ new Enemy(0, 3, 50), new Enemy(0, 1, 70), ];
	player = new Player(2, 5);
	star=new Star();

}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37 : 'left',
		38 : 'up',
		39 : 'right',
		40 : 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
document.getElementById('reset_button').addEventListener('click', function() {
	ResetGame();
});
