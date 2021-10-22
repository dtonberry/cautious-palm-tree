//#region world properties
let player;
let world;
let cursors;
let anims;
let enemies;
let game;
let config;
let music;
//#endregion

//#region puzzle properties
let gameOptions = {
    fieldSize: 7,
    gemColors: 6,
    gemSize: 100,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200
}
const HORIZONTAL = 1;
const VERTICAL = 2;
//#endregion

window.onload = function() {
    config = {
        type: Phaser.AUTO,
        parent: 'game',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 600
        },
        physics: {
            default: 'arcade',
        },
        scene: [MainMenu, IntroScene]
    }
    game = new Phaser.Game(config);
    window.focus();
}

class MainMenu extends Phaser.Scene {

    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image('bg', '../assets/sprites/background.png'); //load our background image
        this.load.image('button', '../assets/sprites/Buttons & Sliders/PNG/green_button05.png');
        //load some audio
        this.load.audio('intro', '../assets/audio/intro.wav');
    }

    create() {
        //#region add background
        let bg = this.add.sprite(-80, 30, 'bg');
        bg.setOrigin(0, 0);
        bg.setScale(0.3);
        //#endregion

        //add the music
        //this.sound.play('intro');

        //#region add game name text
        let text = this.add.text(230, 40, "Tales of Adventure");
        text.setFontSize(32);
        //#endregion

        //#region add selection buttons
        let button = this.add.text(400, 300, "Play Game")
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#000000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', startGame)
    }

    update() {

    }
}
export default MainMenu;

function startGame() {
    game.scene.remove("MainMenu"); //remove (destroy) the open main menu scene
    game.scene.start('IntroScene'); //open the new intro scene
}


//#region Intro Scene
class IntroScene extends Phaser.Scene {
    constructor() {
        super("IntroScene");
    }


    preload() {

        this.load.image('ground', '../assets/sprites/platform.png'); //load the "platform" used for the UI
        this.load.spritesheet('player', '../assets/sprites/characterSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            frames: 24
        }); //this loads our character spritesheet
        this.load.spritesheet('enemies', '../assets/sprites/dude.png', {
            frameWidth: 32,
            frameHeight: 48,
            frames: 9
        }); //this loads out enemies spritesheet
    }

    create() {
        //#region player
        player = this.physics.add.sprite(100, 450, 'player'); //load the player sprite
        player.setScale(2); //fit the sprite to the background
        player.setCollideWorldBounds(true);
        //#endregion

        //lets make some enemies
        enemies = this.physics.add.sprite(150, 300, 'enemies');

        //add those two to a "character" layer
        let layer = this.add.layer();
        layer.add([player, enemies]);

        //we need some physics, can't have everyone overlapping
        // this.physics.add.collider(player, world);
        this.physics.add.collider(player, enemies, hitEnemy, null, this);


        //now lets make the "world", being the black background and HUD
        world = this.physics.add.staticGroup();

        //create corrolation between up, down, left and right keys with the addition of space and shift and game
        cursors = this.input.keyboard.createCursorKeys();

        //#region animations
        //set some animations

        //move forward animation
        this.anims.create({
            key: 'forward',
            frames: this.anims.generateFrameNumbers('player', { frames: [18, 19, 20] })
        })

        //move back animation
        this.anims.create({
            key: 'backward',
            frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 2] })
        })

        //move left animation
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [6, 7, 8] })
        })

        //move right animation
        this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('player', { frames: [12, 13, 14] })
            })
            //#endregion
    }

    update() {
        //if spacebar is pressed
        if (cursors.space.isDown) {
            player.anims.play('attack', true);
        }

        //if left arrow is pressed
        if (cursors.left.isDown) {
            player.x -= 1;
            player.anims.play('left', true);
            player.anims.msPerFrame = 100;
        }
        //if right arrow is down
        else if (cursors.right.isDown) {
            player.x += 1;
            player.anims.play('right', true);
            player.anims.msPerFrame = 100;
        }

        //if up arrow is down
        if (cursors.up.isDown) {
            player.y -= 1;
            player.anims.play('forward', true);
            player.anims.msPerFrame = 100;
        }
        //if down arrow is down
        else if (cursors.down.isDown) {
            player.y += 1;
            player.anims.play('backward', true);
            player.anims.msPerFrame = 100;
        }
    }
}

function hitEnemy(player, enemy) {
    let collisionDetected = false;
    do {
        console.log("Collision Detected");
        collisionDetected = true;
    } while (collisionDetected = false);
    collisionDetected = false;

    return hitEnemy();
}
//#endregion

//#region Puzzle Scene
class PuzzleScene extends Phaser.Scene {
        constructor() {
            super('PuzzleScene');
        }
        preload() {
            this.load.spritesheet("gems", "../assets/sprites/puzzle pieces/gems.png", {
                frameWidth: gameOptions.gemSize,
                frameHeight: gameOptions.gemSize
            });
        }
        create() {
            this.canPick = true;
            this.dragging = false;
            this.drawField();
            this.selectedGem = null;
            this.input.on("pointerdown", this.gemSelect, this);
            this.input.on("pointermove", this.startSwipe, this);
            this.input.on("pointerup", this.stopSwipe, this);
        }
        drawField() {
            this.gameArray = [];
            this.poolArray = [];
            this.gemGroup = this.add.group();
            for (let i = 0; i < gameOptions.fieldSize; i++) {
                this.gameArray[i] = [];
                for (let j = 0; j < gameOptions.fieldSize; j++) {
                    let gem = this.add.sprite(gameOptions.gemSize * j + gameOptions.gemSize / 2, gameOptions.gemSize * i + gameOptions.gemSize / 2, "gems");
                    this.gemGroup.add(gem);
                    do {
                        let randomColor = Phaser.Math.Between(0, gameOptions.gemColors - 1);
                        gem.setFrame(randomColor);
                        this.gameArray[i][j] = {
                            gemColor: randomColor,
                            gemSprite: gem,
                            isEmpty: false
                        }
                    } while (this.isMatch(i, j));
                }
            }
        }
        isMatch(row, col) {
            return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
        }
        isHorizontalMatch(row, col) {
            return this.gemAt(row, col).gemColor == this.gemAt(row, col - 1).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row, col - 2).gemColor;
        }
        isVerticalMatch(row, col) {
            return this.gemAt(row, col).gemColor == this.gemAt(row - 1, col).gemColor && this.gemAt(row, col).gemColor == this.gemAt(row - 2, col).gemColor;
        }
        gemAt(row, col) {
            if (row < 0 || row >= gameOptions.fieldSize || col < 0 || col >= gameOptions.fieldSize) {
                return -1;
            }
            return this.gameArray[row][col];
        }
        gemSelect(pointer) {
            if (this.canPick) {
                this.dragging = true;
                let row = Math.floor(pointer.y / gameOptions.gemSize);
                let col = Math.floor(pointer.x / gameOptions.gemSize);
                let pickedGem = this.gemAt(row, col)
                if (pickedGem != -1) {
                    if (this.selectedGem == null) {
                        pickedGem.gemSprite.setScale(1.2);
                        pickedGem.gemSprite.setDepth(1);
                        this.selectedGem = pickedGem;
                    } else {
                        if (this.areTheSame(pickedGem, this.selectedGem)) {
                            this.selectedGem.gemSprite.setScale(1);
                            this.selectedGem = null;
                        } else {
                            if (this.areNext(pickedGem, this.selectedGem)) {
                                this.selectedGem.gemSprite.setScale(1);
                                this.swapGems(this.selectedGem, pickedGem, true);
                            } else {
                                this.selectedGem.gemSprite.setScale(1);
                                pickedGem.gemSprite.setScale(1.2);
                                this.selectedGem = pickedGem;
                            }
                        }
                    }
                }
            }
        }
        startSwipe(pointer) {
            if (this.dragging && this.selectedGem != null) {
                let deltaX = pointer.downX - pointer.x;
                let deltaY = pointer.downY - pointer.y;
                let deltaRow = 0;
                let deltaCol = 0;
                if (deltaX > gameOptions.gemSize / 2 && Math.abs(deltaY) < gameOptions.gemSize / 4) {
                    deltaCol = -1;
                }
                if (deltaX < -gameOptions.gemSize / 2 && Math.abs(deltaY) < gameOptions.gemSize / 4) {
                    deltaCol = 1;
                }
                if (deltaY > gameOptions.gemSize / 2 && Math.abs(deltaX) < gameOptions.gemSize / 4) {
                    deltaRow = -1;
                }
                if (deltaY < -gameOptions.gemSize / 2 && Math.abs(deltaX) < gameOptions.gemSize / 4) {
                    deltaRow = 1;
                }
                if (deltaRow + deltaCol != 0) {
                    let pickedGem = this.gemAt(this.getGemRow(this.selectedGem) + deltaRow, this.getGemCol(this.selectedGem) + deltaCol);
                    if (pickedGem != -1) {
                        this.selectedGem.gemSprite.setScale(1);
                        this.swapGems(this.selectedGem, pickedGem, true);
                        this.dragging = false;
                    }
                }
            }
        }
        stopSwipe() {
            this.dragging = false;
        }
        areTheSame(gem1, gem2) {
            return this.getGemRow(gem1) == this.getGemRow(gem2) && this.getGemCol(gem1) == this.getGemCol(gem2);
        }
        getGemRow(gem) {
            return Math.floor(gem.gemSprite.y / gameOptions.gemSize);
        }
        getGemCol(gem) {
            return Math.floor(gem.gemSprite.x / gameOptions.gemSize);
        }
        areNext(gem1, gem2) {
            return Math.abs(this.getGemRow(gem1) - this.getGemRow(gem2)) + Math.abs(this.getGemCol(gem1) - this.getGemCol(gem2)) == 1;
        }
        swapGems(gem1, gem2, swapBack) {
            this.swappingGems = 2;
            this.canPick = false;
            let fromColor = gem1.gemColor;
            let fromSprite = gem1.gemSprite;
            let toColor = gem2.gemColor;
            let toSprite = gem2.gemSprite;
            let gem1Row = this.getGemRow(gem1);
            let gem1Col = this.getGemCol(gem1);
            let gem2Row = this.getGemRow(gem2);
            let gem2Col = this.getGemCol(gem2);
            this.gameArray[gem1Row][gem1Col].gemColor = toColor;
            this.gameArray[gem1Row][gem1Col].gemSprite = toSprite;
            this.gameArray[gem2Row][gem2Col].gemColor = fromColor;
            this.gameArray[gem2Row][gem2Col].gemSprite = fromSprite;
            this.tweenGem(gem1, gem2, swapBack);
            this.tweenGem(gem2, gem1, swapBack);
        }
        tweenGem(gem1, gem2, swapBack) {
            let row = this.getGemRow(gem1);
            let col = this.getGemCol(gem1);
            this.tweens.add({
                targets: this.gameArray[row][col].gemSprite,
                x: col * gameOptions.gemSize + gameOptions.gemSize / 2,
                y: row * gameOptions.gemSize + gameOptions.gemSize / 2,
                duration: gameOptions.swapSpeed,
                callbackScope: this,
                onComplete: function() {
                    this.swappingGems--;
                    if (this.swappingGems == 0) {
                        if (!this.matchInBoard() && swapBack) {
                            this.swapGems(gem1, gem2, false);
                        } else {
                            if (this.matchInBoard()) {
                                this.handleMatches();
                            } else {
                                this.canPick = true;
                                this.selectedGem = null;
                            }
                        }
                    }
                }
            });
        }
        matchInBoard() {
            for (let i = 0; i < gameOptions.fieldSize; i++) {
                for (let j = 0; j < gameOptions.fieldSize; j++) {
                    if (this.isMatch(i, j)) {
                        return true;
                    }
                }
            }
            return false;
        }
        handleMatches() {
            this.removeMap = [];
            for (let i = 0; i < gameOptions.fieldSize; i++) {
                this.removeMap[i] = [];
                for (let j = 0; j < gameOptions.fieldSize; j++) {
                    this.removeMap[i].push(0);
                }
            }
            this.markMatches(HORIZONTAL);
            this.markMatches(VERTICAL);
            this.destroyGems();
        }
        markMatches(direction) {
            for (let i = 0; i < gameOptions.fieldSize; i++) {
                let colorStreak = 1;
                let currentColor = -1;
                let startStreak = 0;
                let colorToWatch = 0;
                for (let j = 0; j < gameOptions.fieldSize; j++) {
                    if (direction == HORIZONTAL) {
                        colorToWatch = this.gemAt(i, j).gemColor;
                    } else {
                        colorToWatch = this.gemAt(j, i).gemColor;
                    }
                    if (colorToWatch == currentColor) {
                        colorStreak++;
                    }
                    if (colorToWatch != currentColor || j == gameOptions.fieldSize - 1) {
                        if (colorStreak >= 3) {
                            if (direction == HORIZONTAL) {
                                console.log("HORIZONTAL :: Length = " + colorStreak + " :: Start = (" + i + "," + startStreak + ") :: Color = " + currentColor);
                            } else {
                                console.log("VERTICAL :: Length = " + colorStreak + " :: Start = (" + startStreak + "," + i + ") :: Color = " + currentColor);
                            }
                            for (let k = 0; k < colorStreak; k++) {
                                if (direction == HORIZONTAL) {
                                    this.removeMap[i][startStreak + k]++;
                                } else {
                                    this.removeMap[startStreak + k][i]++;
                                }
                            }
                        }
                        startStreak = j;
                        colorStreak = 1;
                        currentColor = colorToWatch;
                    }
                }
            }
        }
        destroyGems() {
            let destroyed = 0;
            for (let i = 0; i < gameOptions.fieldSize; i++) {
                for (let j = 0; j < gameOptions.fieldSize; j++) {
                    if (this.removeMap[i][j] > 0) {
                        destroyed++;
                        this.tweens.add({
                            targets: this.gameArray[i][j].gemSprite,
                            alpha: 0.5,
                            duration: gameOptions.destroySpeed,
                            callbackScope: this,
                            onComplete: function() {
                                destroyed--;
                                this.gameArray[i][j].gemSprite.visible = false;
                                this.poolArray.push(this.gameArray[i][j].gemSprite);
                                if (destroyed == 0) {
                                    this.makeGemsFall();
                                    this.replenishField();
                                }
                            }
                        });
                        this.gameArray[i][j].isEmpty = true;
                    }
                }
            }
        }
        makeGemsFall() {
            for (let i = gameOptions.fieldSize - 2; i >= 0; i--) {
                for (let j = 0; j < gameOptions.fieldSize; j++) {
                    if (!this.gameArray[i][j].isEmpty) {
                        let fallTiles = this.holesBelow(i, j);
                        if (fallTiles > 0) {
                            this.tweens.add({
                                targets: this.gameArray[i][j].gemSprite,
                                y: this.gameArray[i][j].gemSprite.y + fallTiles * gameOptions.gemSize,
                                duration: gameOptions.fallSpeed * fallTiles
                            });
                            this.gameArray[i + fallTiles][j] = {
                                gemSprite: this.gameArray[i][j].gemSprite,
                                gemColor: this.gameArray[i][j].gemColor,
                                isEmpty: false
                            }
                            this.gameArray[i][j].isEmpty = true;
                        }
                    }
                }
            }
        }
        holesBelow(row, col) {
            let result = 0;
            for (let i = row + 1; i < gameOptions.fieldSize; i++) {
                if (this.gameArray[i][col].isEmpty) {
                    result++;
                }
            }
            return result;
        }
        replenishField() {
            let replenished = 0;
            for (let j = 0; j < gameOptions.fieldSize; j++) {
                let emptySpots = this.holesInCol(j);
                if (emptySpots > 0) {
                    for (let i = 0; i < emptySpots; i++) {
                        replenished++;
                        let randomColor = Phaser.Math.Between(0, gameOptions.gemColors - 1);
                        this.gameArray[i][j].gemColor = randomColor;
                        this.gameArray[i][j].gemSprite = this.poolArray.pop()
                        this.gameArray[i][j].gemSprite.setFrame(randomColor);
                        this.gameArray[i][j].gemSprite.visible = true;
                        this.gameArray[i][j].gemSprite.x = gameOptions.gemSize * j + gameOptions.gemSize / 2;
                        this.gameArray[i][j].gemSprite.y = gameOptions.gemSize / 2 - (emptySpots - i) * gameOptions.gemSize;
                        this.gameArray[i][j].gemSprite.alpha = 1;
                        this.gameArray[i][j].isEmpty = false;
                        this.tweens.add({
                            targets: this.gameArray[i][j].gemSprite,
                            y: gameOptions.gemSize * i + gameOptions.gemSize / 2,
                            duration: gameOptions.fallSpeed * emptySpots,
                            callbackScope: this,
                            onComplete: function() {
                                replenished--;
                                if (replenished == 0) {
                                    if (this.matchInBoard()) {
                                        this.time.addEvent({
                                            delay: 250,
                                            callback: this.handleMatches()
                                        });
                                    } else {
                                        this.canPick = true;
                                        this.selectedGem = null;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
        holesInCol(col) {
            var result = 0;
            for (let i = 0; i < gameOptions.fieldSize; i++) {
                if (this.gameArray[i][col].isEmpty) {
                    result++;
                }
            }
            return result;
        }
    }
    //#endregion