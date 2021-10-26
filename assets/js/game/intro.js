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
        width: 800,
        height: 600,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
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
        // this.sound.play('intro');

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

            //lets load the actually scene JSON
            this.load.image('base_tiles', '../PhaserEditor Files/assets/!CL_DEMO_48x48.png');
            this.load.tilemapTiledJSON('tilemap', '../PhaserEditor Files/assets/introscene.json');
        }

        create() {

            //lets set the world fps to 60 for reasons
            this.physics.world.setFPS(60);

            //#region player
            player = this.physics.add.sprite(100, 450, 'player'); //load the player sprite
            player.setScale(3); //fit the sprite to the background
            player.setCollideWorldBounds(true);
            //#endregion

            //add those two to a "character" layer
            let spriteLayer = this.add.layer();
            spriteLayer.add(player);
            spriteLayer.depth = 100;

            //now lets make the "world", being the black background and HUD
            world = this.physics.add.staticGroup();

            //create corrolation between up, down, left and right keys with the addition of space and shift and game
            cursors = this.input.keyboard.createCursorKeys();

            //load the scene
            let map = this.make.tilemap({ key: 'tilemap' });
            let tileset = map.addTilesetImage('introscene', 'base_tiles');
            let baseLayer = map.createLayer('base', tileset, 0, 0);
            let furnitureLayer = map.createLayer('furniture', tileset, 0, 0);

            //set up camera so that you can't move outside the tilemap
            let camera = this.cameras.main.setBounds(0, 0, 10, 10);

            //we need some physics, can't have everyone overlapping
            // this.physics.add.collider(player, world);
            furnitureLayer.setCollisionBetween(629, 630);
            this.physics.add.collider(player, furnitureLayer);

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
                player.x -= 1.5;
                player.anims.play('left', true);
                player.anims.msPerFrame = 100;
            }
            //if right arrow is down
            else if (cursors.right.isDown) {
                player.x += 1.5;
                player.anims.play('right', true);
                player.anims.msPerFrame = 100;
            }

            //if up arrow is down
            if (cursors.up.isDown) {
                player.y -= 1.5;
                player.anims.play('forward', true);
                player.anims.msPerFrame = 100;
            }
            //if down arrow is down
            else if (cursors.down.isDown) {
                player.y += 1.5;
                player.anims.play('backward', true);
                player.anims.msPerFrame = 100;
            }
        }
    }
    //#endregion