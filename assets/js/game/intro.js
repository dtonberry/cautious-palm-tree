import TILES from "./tile-mapping.js";
import TownScene from "./townscene.js";

//#region world properties
let player;
let world;
let cursors;
let anims;
let enemies;
let game;
let config;
let music;
let doorOpen = false;
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
            arcade: {
                gravity: {
                    x: 0,
                    y: 0
                },
                tileBias: 48
            }
        },
        antialias: false,
        scene: [MainMenu, IntroScene, TownScene]
    }
    game = new Phaser.Game(config);
    window.focus();
}

export default class MainMenu extends Phaser.Scene {

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
        let bg = this.add.sprite(-80, 0, 'bg');
        bg.setOrigin(0, 0);
        bg.setScale(1.6);
        //#endregion

        //add the music
        // this.sound.play('intro');

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

function startGame() {
    game.scene.remove("MainMenu"); //remove (destroy) the open main menu scene
    game.scene.start('IntroScene'); //open the new intro scene
}


//#region Intro Scene
export class IntroScene extends Phaser.Scene {
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

            let camera = this.cameras.main; //initialize the camera

            //create corrolation between up, down, left and right keys with the addition of space and shift and game
            cursors = this.input.keyboard.createCursorKeys();

            //load the scene
            let map = this.make.tilemap({ key: 'tilemap' });
            let tileset = map.addTilesetImage('!CL_DEMO_48x48', 'base_tiles');

            //set the world bounds to the edge of the camera
            //set the world to 30 fps so that we don't eat up too much CPU
            this.physics.world.setFPS(30);
            this.physics.world.setBounds(0, 0, map.x, camera.y - map.y);

            //create layers
            let baseLayer = map.createLayer('base', tileset, 0, 0);
            let furnitureLayer = map.createLayer('furniture', tileset, 0, 0);
            let doorLayer = map.createLayer('door', tileset, 0, 0);

            //#region player
            player = this.physics.add
                .sprite(400, 450, "player"); //load the player sprite
            player.setScale(3); //fit the sprite to the background
            player.body.setCollideWorldBounds(true, 1, 1);
            player.setBounce(1);
            //#endregion

            //set up camera so that you can't move outside the tilemap
            camera.startFollow(player);
            camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

            //we need some physics, can't have everyone overlapping
            furnitureLayer.setCollisionByProperty({ collides: true });
            baseLayer.setCollisionByProperty({ collides: true });
            //add collision for furniture layer
            this.physics.add.collider(player, furnitureLayer, () => console.log("collided"), null, this);
            //add collision for base layer
            this.physics.add.collider(player, baseLayer, () => console.log("collided"), null, this);

            //debug to check player hitbox
            this.input.keyboard.once("keydown-D", event => {
                this.physics.world.createDebugGraphic();
            });

            //check if player is at the door
            doorLayer.setTileIndexCallback(TILES.DOOR, () => {
                doorLayer.setTileIndexCallback(TILES.DOOR, null);
                camera.fade(250, 0, 0, 0);
                camera.once("camerafadeoutcomplete", () => {
                    this.scene.stop("IntroScene");
                    this.scene.start("TownScene");
                });
            });
            this.physics.add.overlap(player, doorLayer);


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
            player.body.setVelocity(0);

            //if spacebar is pressed
            if (cursors.space.isDown) {
                player.anims.play('attack', true);
            }

            //if left arrow is pressed
            if (cursors.left.isDown) {
                player.body.setVelocityX(-100);
                player.anims.play('left', true);
                player.anims.msPerFrame = 100;
            }
            //if right arrow is down
            else if (cursors.right.isDown) {
                player.body.setVelocityX(100);
                player.anims.play('right', true);
                player.anims.msPerFrame = 100;
            }

            //if up arrow is down
            if (cursors.up.isDown) {
                player.body.setVelocityY(-100);
                player.anims.play('forward', true);
                player.anims.msPerFrame = 100;
            }
            //if down arrow is down
            else if (cursors.down.isDown) {
                player.body.setVelocityY(100);
                player.anims.play('backward', true);
                player.anims.msPerFrame = 100;
            }
        }
    }
    //#endregion