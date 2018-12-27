// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('pipe_end_top', 'assets/pipe_end_top.png');
        game.load.image('pipe_end_bottom', 'assets/pipe_end_bottom.png');
        game.load.audio('jump', 'assets/jump.wav');
    },

    create: function () { 
        
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc. 
        game.stage.backgroundColor = '#00b9f2';
        
        //set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create an empty group clouds
        this.clouds = game.add.group();
        this.timer = game.time.events.loop(15000, this.addCloudSmall, this);
        this.timer = game.time.events.loop(10500, this.addCloud, this);
        this.timer = game.time.events.loop(8500, this.addCloudBig, this);
        this.addCloudBig();

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');
        

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);
        
        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;  
        
        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);      

        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.escButton, this);

        game.input.onDown.add(this.jump, this);
        
        // Create an empty group pipes
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 
        
        //Set content to center 
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();
        
        //Add score element
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Agency FB", fontWeight: "bold", fill: "#ffffff" }); 
        
         // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5); 
        
        //Load jump audio
        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.1; 
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
        
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 490){
            this.restartGame();
        }
        
        //Collisin detect. If bird overlap pipes we restart the game
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
        
        //Animate rectangle
        if (this.bird.angle < 20){
            this.bird.angle += 1;
        }
        
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);  
    },

    //pause menu
    escButton: function () {
        game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
    },

    // Make the bird jump 
    jump: function () {
        if (game.physics.arcade.isPaused)
            return;
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
        
        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start(); 
        
        //play jump melody
        if (isMusicPlay) {
            this.jumpSound.play();
        }
        if (this.bird.alive == false) return; 
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
    
    addOnePipe: function(x, y, type) {
        // Create a pipe at the position x and y
        var pipe = null;
        
        if(type == 1){
           pipe = game.add.sprite(x, y, 'pipe');
        } else if(type == 2){
            pipe = game.add.sprite(x, y, 'pipe_end_top');
        } else if (type == 3) {
            pipe = game.add.sprite(x, y, 'pipe_end_bottom');
        }

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 

        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function () {
        if (game.physics.arcade.isPaused)
            return;
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 10; i++){
            if (i != hole && i != hole + 1 && i != hole + 2){
                if (i == hole - 1) {
                    this.addOnePipe(400, i * 50, 3);
                } else if (i == hole + 3) {
                    this.addOnePipe(400, i * 50, 2);
                } else {
                    this.addOnePipe(400, i * 50, 1);   
                }
            }
        }
        
        this.score += 1;
        this.labelScore.text = (this.score - 1) < 0 ? 0 : (this.score - 1);  
    },

    addCloud: function () {
        if (game.physics.arcade.isPaused)
            return;
        var cloud = game.add.sprite(400, Math.floor(Math.random() * 400), 'cloud3');
        // Add the pipe to our previously created group
        this.clouds.add(cloud);

        // Enable physics on the pipe 
        game.physics.arcade.enable(cloud);

        // Add velocity to the pipe to make it move left
        cloud.body.velocity.x = -33;

        // Automatically kill the pipe when it's no longer visible 
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },

    addCloudSmall: function () {
        if (game.physics.arcade.isPaused)
            return;
        var cloud = game.add.sprite(400, Math.floor(Math.random() * 400), 'cloud1');
        // Add the pipe to our previously created group
        this.clouds.add(cloud);

        // Enable physics on the pipe 
        game.physics.arcade.enable(cloud);

        // Add velocity to the pipe to make it move left
        cloud.body.velocity.x = -27;

        // Automatically kill the pipe when it's no longer visible 
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },

    addCloudBig: function () {
        if (game.physics.arcade.isPaused)
            return;
        var cloud = game.add.sprite(400, Math.floor(Math.random() * 400), 'cloud2');
        // Add the pipe to our previously created group
        this.clouds.add(cloud);

        // Enable physics on the pipe 
        game.physics.arcade.enable(cloud);

        // Add velocity to the pipe to make it move left
        cloud.body.velocity.x = -30;

        // Automatically kill the pipe when it's no longer visible 
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },
    
    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }, 
};

var btnMusicOff;
var btnMusicOn;
var backgroundMusic;
var isMusicPlay;
var creditsMain;
var scoreList;

mainMenu = {
    preload: function() {
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
        game.load.spritesheet('play_button', 'assets/play_button.png', 119, 74);
       // game.load.spritesheet('score_button', 'assets/score_button.png', 180, 128);
        game.load.image('cloud1', 'assets/cloud1.png');
        game.load.image('cloud2', 'assets/cloud2.png');
        game.load.image('cloud3', 'assets/cloud3.png');
        game.load.image('bird', 'assets/bird2.png');
        game.load.image('music_on_icon', 'assets/music_on_icon.png');
        game.load.image('music_off_icon', 'assets/music_off_icon.png');

        game.load.audio('background_music', 'assets/sunnyDayWhistler.mp3');
    },

    create: function () {
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc. 
        game.stage.backgroundColor = '#00b9f2';
        if (!isMusicLoaded) {
            this.loadMusic();
            isMusicLoaded = true;
        }
        this.clouds = game.add.group();
        this.timer = game.time.events.loop(15000, this.addCloudSmall, this);
        this.timer = game.time.events.loop(10500, this.addCloud, this);
        this.timer = game.time.events.loop(8500, this.addCloudBig, this);
        this.addCloudBig();

        btnMusicOff = game.add.button(370, 10, 'music_off_icon', this.onOffMusicClick, this, 0, 1, 0);
        btnMusicOn = game.add.button(370, 10, 'music_on_icon', this.onOffMusicClick, this, 0, 1, 0);
        if (isMusicPlay) {
            btnMusicOn.visible = false;
        } else {
            btnMusicOff.visible = false;
        }

        var btnPlay = game.add.button(game.world.centerX, 360, 'play_button', this.playClick, this, 0, 1, 0);
        btnPlay.anchor.set(0.5, 0.5);


        //this.labelScore = game.add.text(game.world.centerX, 420, "SCORE", { font: "30px Agency FB", fontWeight: "bold", fill: "#ffffff" });
        //this.labelScore.anchor.set(0.5, 0.5);
        //this.labelScore.inputEnabled = true;
        //this.labelScore.events.onInputDown.add(this.showScore, this);

        this.labelCredits = game.add.text(game.world.centerX, 420, "CREDITS", { font: "24px Agency FB", fontWeight: "bold", fill: "#ffffff" });
        this.labelCredits.anchor.set(0.5, 0.5);
        this.labelCredits.inputEnabled = true;
        this.labelCredits.events.onInputDown.add(this.showCredits, this);

        //set physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Display the bird at the position x=175 and y=245
        this.bird = game.add.sprite(175, 245, 'bird');

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;  
        this.timer = game.time.events.loop(685, this.jump, this);
        this.jump();
        //Set content to center 
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 490) {
            this.restartGame();
        }

        //Collisin detect. If bird overlap pipes we restart the game
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);

        //Animate rectangle
        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        }

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },

    loadMusic: function () {
        //to play music in background and loop them
        backgroundMusic = game.add.audio('background_music');
        backgroundMusic.loop = true; // This is what you are lookig for
        backgroundMusic.volume = 0.5;
        backgroundMusic.play();
        isMusicPlay = true;
    },

    showScore: function () {
        console.log("score");

        if (this.scoreList == null) {
            var scoreList = "       SCORE:";
            for (var i = 1; i <= 8; i++) {
                scoreList += this.genereateScoreString(i);
            }
            this.scoreList = game.add.text(game.world.centerX, 10, scoreList, { font: "24px Agency FB", fontWeight: "bold", fill: "#595b5c", backgroundColor: "#00b9f2" });
            this.scoreList.anchor.set(0.5, 0);
        } else {
            this.hideScore();
        }
    },

    genereateScoreString: function (number) {
        return "\r\n       " + number + ". Adam " + number + "         ";
    },

    hideScore: function () {
        if (this.creditsMain != null)
            this.creditsMain.destroy();
        this.creditsMain = null
    },

    showCredits: function () {
        if (this.creditsMain == null) {
            this.creditsMain = game.add.text(game.world.centerX, 150, "           Fla-PI\r\n Game created by:\r\n    Adam Swiatek\r\n\r\n", { font: "24px Agency FB", fontWeight: "bold", fill: "#ffffff" });
            this.creditsMain.anchor.set(0.5, 0.5);
        } else{
            this.hideCredits();
        }
    },

    hideCredits: function () {
        if (this.creditsMain != null)
            this.creditsMain.destroy();
        this.creditsMain = null
    },

    onOffMusicClick: function () {
        if (btnMusicOn.visible) {
            backgroundMusic.play();
            btnMusicOn.visible = false;
            btnMusicOff.visible = true;
            isMusicPlay = true;
        } else {
            backgroundMusic.stop();
            btnMusicOff.visible = false;
            btnMusicOn.visible = true;
            isMusicPlay = false;
        }
    },

    playClick: function () {
        this.hideCredits();
        this.gameStarted = true;
        //game.state.stop('main');
        // Start the state to actually start the game
        game.state.start('game');
    },

    addCloud: function () {
        var cloud = game.add.sprite(400, Math.floor(Math.random() * 400), 'cloud3');
        // Add the pipe to our previously created group
        this.clouds.add(cloud);

        // Enable physics on the pipe 
        game.physics.arcade.enable(cloud);

        // Add velocity to the pipe to make it move left
        cloud.body.velocity.x = -33;

        // Automatically kill the pipe when it's no longer visible 
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },

    addCloudSmall: function () {
        var cloud = game.add.sprite(400, Math.floor(Math.random() * 400), 'cloud1');
        // Add the pipe to our previously created group
        this.clouds.add(cloud);

        // Enable physics on the pipe 
        game.physics.arcade.enable(cloud);

        // Add velocity to the pipe to make it move left
        cloud.body.velocity.x = -27;

        // Automatically kill the pipe when it's no longer visible 
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },

    addCloudBig: function () {
        var cloud = game.add.sprite(400, Math.floor(Math.random() * 400), 'cloud2');
        // Add the pipe to our previously created group
        this.clouds.add(cloud);

        // Enable physics on the pipe 
        game.physics.arcade.enable(cloud);

        // Add velocity to the pipe to make it move left
        cloud.body.velocity.x = -30;

        // Automatically kill the pipe when it's no longer visible 
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },

    // Make the bird jump 
    jump: function () {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({ angle: -20 }, 100);

        // And start the animation
        animation.start();
    },
}

    var isMusicLoaded = false;
    // Initialize Phaser, and create a 400px by 490px game
    var game = new Phaser.Game(400, 490);

    //to create transparent background
    //var game = new Phaser.Game(400, 490, Phaser.AUTO, "", null, true, true, null);

    // Add the 'mainState' and call it 'main'
    game.state.add('game', mainState);

    // Add the 'mainState' and call it 'main'
    game.state.add('main', mainMenu);

    // Start the state to actually start the game
    game.state.start('main');