function preload() {
    this.load.image('bug1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bug_1.png');
	this.load.image('bug2', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bug_2.png');
	this.load.image('bug3', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/bug_3.png');
	this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
	this.load.image('codey', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Bug+Invaders/codey.png');
}

const gameState = {
    score: 0,
    //highScore: 0

};

let highScore = 0;

function create() {
	
	gameState.active = true;
	this.input.on('pointerup', () => {
		if (gameState.active === false) {
			this.scene.restart();
		}
	})
	
    gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(.5);

    const platforms = this.physics.add.staticGroup();

    platforms.create(225, 510, 'platform').setScale(1, .7).refreshBody();

    gameState.scoreText = this.add.text(195, 485, 'Score: 0', { fontSize: '15px', fill: '#000000' });
    gameState.highScoreText = this.add.text(195, 500, `High Score: ${highScore}`, { fontSize: '15px', fill: '#000000' });

    gameState.player.setCollideWorldBounds(true);

    this.physics.add.collider(gameState.player, platforms);

    gameState.cursors = this.input.keyboard.createCursorKeys();

    const bugs = this.physics.add.group();

    function bugGen() {
        const xCoord = Math.random() * 450;
        bugs.create(xCoord, 10, 'bug1').setScale(.6);
    }

    const bugGenLoop = this.time.addEvent({
        delay: 100,
        callback: bugGen,
        callbackScope: this,
        loop: true,
    });

    this.physics.add.collider(bugs, platforms, function (bug) {
        bug.destroy();
        gameState.score += 10;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        
        //gameState.highScoreText.setText(`Score: ${gameState.score}`);
    })

    this.physics.add.collider(gameState.player, bugs, () => {
        gameState.active = false;
		bugGenLoop.destroy();
        this.physics.pause();
        this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
        this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
        if (gameState.score > highScore) {
            //gameState.highScoreText.setText(`High Score: ${gameState.score}`);
            highScore = gameState.score;
        }
        

        
    });
}

function update() {
    if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-160);
    } else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(160);
    } else {
        gameState.player.setVelocityX(0);
    }

    if(gameState.cursors.space.isDown) {
        gameState.score = 0;
        //highScore=
        this.scene.restart();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 450,
    height: 520,
    backgroundColor: "b9eaff",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody: true,
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);
