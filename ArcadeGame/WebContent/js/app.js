// Enemies our player must avoid
var Enemy = function(sX, sY, sP) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	this.sprite = 'images/enemy-bug.png';
	this.x = sX * 101;
	this.y = (sY * 83) - (83 / 3);
	// pixels
	this.speed = sP;
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images

}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	if ((this.x + dt * this.speed) < 505) {
		this.x = this.x + dt * this.speed;
	} else {
		this.x = -101;
	}

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sX, sY) {
	this.sprite = 'images/char-horn-girl.png';
	this.x = sX * 101;
	this.y = (sY * 83) - (83 / 3);
	// extra functionalities
	this.score = 0;
	this.lives = 3;
}

Player.prototype.update = function() {
	// Detecting collistions
	var Px = this.x;
	var Py = this.y.toFixed(0);
	var Pw = parseFloat(Resources.get(this.sprite).width);
	var PxVision = +Px.toFixed(0) + (+Pw / 6);
	var Px2Vision = +Px + +Pw - (+Pw / 3);
	// collision enemies
	for (enemy in allEnemies) {
		if (collision(Py, PxVision, Px2Vision, allEnemies[enemy])) {
			var Plives = this.lives;
			if ((Plives - 1) == -1) {
				// poner algo para esperar o yoq ue se
				hardReset();
			} else {
				this.lives -= 1;
				console.log('Lives left ' + this.lives)
				this.x = 2 * 101;
				this.y = (5 * 83) - (83 / 3);
			}
		}

	}
	// collision stars create stars element y su puta madre
	document.getElementById('game_lives').innerHTML = this.lives;
	document.getElementById('game_score').innerHTML = this.score;

	// $("#game_lives").update(''+player.lives);
	// $("#game_score").update(''+player.score);

}
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(direcction) {
	switch (direcction) {
	case 'left':
		if ((this.x - 101) >= 0)
			this.x = this.x - 101;
		break;
	case 'right':
		if ((this.x + 101) < 505)
			this.x = this.x + 101;
		break;
	case 'up':
		if ((this.y - 83) >= 0)
			this.y = this.y - 83;
		else {
			this.y = (5 * 83) - (83 / 3);
			this.score += 100;
			console.log("Score " + this.score);
		}
		break;
	case 'down':
		if ((this.y + 83) <= (606 - 166))
			this.y = this.y + 83;
		break;
	default:
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [ new Enemy(0, 3, 50), new Enemy(0, 1, 70), ];
var player = new Player(2, 5);

//
function collision(PY, PX, PX2, Object) {
	var OX = Object.x.toFixed(0);
	var OY = Object.y.toFixed(0);
	var OW = parseFloat(Resources.get(Object.sprite).width);
	var OX2 = +OX + +OW;
	if (OY == PY && (PX <= OX2) && (OX <= PX2)) {
		console.log('COLLISION!!')
		return true;
	}
	return false;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
function hardReset() {
	console.log('Reset');// Engine
	allEnemies = [ new Enemy(0, 3, 50), new Enemy(0, 1, 70), ];
	player = new Player(2, 5);
}
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
	hardReset();
});
