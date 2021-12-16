import TILES from "./tile-mapping.js";
import TownScene from "./townscene.js";
import PlayGame from "./puzzleScene.js";
import IntroCutscene from "./introCutscene.js";
import HouseScene from "./houseScene.js";
import DungeonMap1 from "./dungeonSceneMap1.js";
import DungeonMap2 from "./dungeonSceneMap2.js";

//constants
const COLOR_PRIMARY = 0xAAAEE;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

//#region world properties
let player;
let world;
let cursors;
let anims;
let enemies;
let game;
let config;
let dialog;
let music;
let doorOpen = false;
let questAccepted;
let fantasybg;
let keyboardEnabled;
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
        scene: [MainMenu, IntroScene, TownScene, PlayGame, IntroCutscene, HouseScene, DungeonMap1, DungeonMap2]
    }
    game = new Phaser.Game(config);
    window.focus();
}

export default class MainMenu extends Phaser.Scene {

    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image('bg', '../assets/images/background.png'); //load our background image
        this.load.spritesheet('fantasy', '../assets/images/fantasy.png', {
            frameWidth: 2500 / 5,
            frameHeight: 1668 / 6,
            frames: 30
        });
        this.load.image('button', '../assets/sprites/Buttons & Sliders/PNG/green_button05.png');
        //load some audio
        this.load.audio('intro', '../assets/audio/MainMenu.wav');
        this.load.audio('gloom', '../assets/audio/intro.WAV');
        this.load.audio('dungeon', '../assets/audio/dungeon.wav');
        this.load.audio('town', '../assets/audio/town.wav');
    }

    create() {
        //#region add background
        fantasybg = this.add.sprite(400, 300, 'fantasy');
        fantasybg.displayHeight = 600;
        fantasybg.displayWidth = 800;
        let bg = this.add.sprite(10, 400, 'bg');
        bg.setOrigin(0, 0);
        bg.setScale(0.8);

        this.anims.create({
            key: 'fantasy',
            frames: this.anims.generateFrameNumbers('fantasy', { start: 0, end: 29, first: 0 })
        })


        //#endregion

        this.tweens.add({
            targets: bg,
            x: 700,
            props: {
                y: { value: 20, duration: 1500, ease: 'Bounce.easeIn' },
            },
            delay: 1000
        });

        this.tweens.add({
            targets: bg,
            alpha: {
                start: 0.1,
                from: 0.1,
                to: 1
            },
            delay: 1000,
            duration: 1500
        });

        //add the music
        let audio = this.sound.play('intro', { loop: true });
        this.sound.volume = 0.01;


        //#region add selection buttons
        let button = this.add.text(400, 300, "Play Game")
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#000000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', startGame)

        button.setVisible(false);

        //fade in and when complete, show the play button
        this.cameras.main.fadeIn(2500);
        this.cameras.main.once('camerafadeincomplete', function() {
            button.setVisible(true);
        });
    }

    update() {
        fantasybg.anims.play('fantasy', true);
    }
}



function startGame() {
    game.sound.stopAll();
    localStorage.setItem("QuestAccepted", 0);
    game.scene.remove("MainMenu"); //remove (destroy) the open main menu scene
    game.scene.start('IntroScene'); //open the new intro scene
}




//#region Intro Scene
export class IntroScene extends Phaser.Scene {
    constructor() {
        super("IntroScene");
    }


    preload() {
        //#region importing spritesheets
        this.load.spritesheet('player', '../assets/sprites/Player Sprites/player.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        }); //this loads our character spritesheet


        //lets load the actually scene JSON
        this.load.image('base_tiles', '../PhaserEditor Files/assets/!CL_DEMO_48x48.png');
        this.load.tilemapTiledJSON('tilemap', '../PhaserEditor Files/assets/introscene.json');
        this.anims.remove('forward');
        this.anims.remove('backward');
        this.anims.remove('left');
        this.anims.remove('right');

        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);

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
        player.setScale(2); //fit the sprite to the background
        player.body.setCollideWorldBounds(true, 1, 1);
        player.setBounce(1);
        //#endregion

        this.input.keyboard.disableGlobalCapture();
        //set up camera so that you can't move outside the tilemap
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //we need some physics, can't have everyone overlapping
        furnitureLayer.setCollisionByProperty({ collides: true });
        baseLayer.setCollisionByProperty({ collides: true });
        //add collision for furniture layer
        let furnCollider = this.physics.add.collider(player, furnitureLayer, () => console.log("collided"), null, this);
        //add collision for base layer
        this.physics.add.collider(player, baseLayer, () => console.log("collided"), null, this);

        //debug to check player hitbox
        // this.input.keyboard.once("keydown-D", event => {
        //     inventory.push("red")
        // });

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
        keyboardEnabled = false;


        //#region animations
        //set some animations

        //move forward animation
        this.anims.create({
            key: 'forward',
            frames: this.anims.generateFrameNumbers('player', { frames: [9, 10, 11, 10] })
        })

        //move back animation
        this.anims.create({
            key: 'backward',
            frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 2, 1] })
        })

        //move left animation
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [3, 4, 5, 4] })
        })

        //move right animation
        this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('player', { frames: [6, 7, 8, 7] })
            })
            //#endregion

        //#region dialog box
        let rect = this.add.rexRoundRectangle(player.body.position.x + 50, player.body.position.y + 225, 600, 100, 32, 0x000000, 0.5);
        rect.setInteractive()
            .on('pointerdown', function() {
                dialogBox.setText("Welcome to Tales of Adventure")
                rect.on('pointerdown', function() {
                    dialogBox.setText("Movement is done using the arrow keys\nInteracting with objects with space\nand holding arrow towards them")
                    rect.on('pointerdown', function() {
                        dialogBox.setText("Solve puzzles by dragging the gems\nwith the left mouse button", { align: 'center' })
                        rect.on('pointerdown', function() {
                            keyboardEnabled = true;
                            rect.setVisible(false);
                            dialogBox.setVisible(false);
                        })
                    })
                })
            });

        let dialogBox = this.add.text(450, 650, "Hello!\nClick this box to continue", { align: 'left' });
        dialogBox.setOrigin(0.5, 0.5);


        //#endregion


    }




    update() {

        if (keyboardEnabled == true) {
            this.input.keyboard.enabled = true;
        } else if (keyboardEnabled == false) {
            this.input.keyboard.enabled = false
        }
        player.body.setVelocity(0);
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

// function RemoveBody(object) {
//     if (object.body.enable == false) {
//         object.body.enable = true;
//     }
// }