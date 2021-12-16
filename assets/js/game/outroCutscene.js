import TILES from './tile-mapping.js';
import MainMenu from './intro.js';

let player;
let gameComplete;
let sultanate;
let adil;
let destin;
let erian;
let auryn;
let carys;
let text;
let amuletPlaced;
let amulet;
let tween;

export default class OutroCutscene extends Phaser.Scene {
    constructor() {
        super("OutroCutscene");
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

        this.load.spritesheet('sultanate', '../assets/sprites/Player Sprites/sultanate.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        }); //this loads sultanate spritesheet

        this.load.spritesheet('adil', '../assets/sprites/Player Sprites/adil.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        }); //this loads adil spritesheet

        this.load.spritesheet('destin', '../assets/sprites/Player Sprites/destin.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        }); //this loads destin spritesheet

        this.load.spritesheet('erian', '../assets/sprites/Player Sprites/erian.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        }); //this loads erian spritesheet

        this.load.spritesheet('auryn', '../assets/sprites/Player Sprites/auryn.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        }); //this loads auryn spritesheet

        this.load.spritesheet('adil', '../assets/sprites/Player Sprites/adil.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        }); //this loads auryn spritesheet

        this.load.image('amulet', '../assets/sprites/amulet.png');
    }

    create(data) {

        //load the scene
        let map = this.make.tilemap({ key: 'tilemap' });
        let tileset = map.addTilesetImage('!CL_DEMO_48x48', 'base_tiles');

        //set the world bounds to the edge of the camera
        //set the world to 30 fps so that we don't eat up too much CPU
        this.physics.world.setFPS(30);

        //create layers
        let baseLayer = map.createLayer('base', tileset, 0, 0);
        let furnitureLayer = map.createLayer('furniture', tileset, 0, 0);
        let doorLayer = map.createLayer('door', tileset, 0, 0);

        //#region player
        player = this.physics.add
            .staticSprite(600, 250, "player"); //load the player sprite
        player.setScale(2); //fit the sprite to the background

        destin = this.physics.add
            .staticSprite(500, 250, "destin"); //load the player sprite
        destin.setScale(2); //fit the sprite to the background

        erian = this.physics.add
            .staticSprite(600, 500, "erian"); //load the player sprite
        erian.setScale(2); //fit the sprite to the background

        adil = this.physics.add
            .staticSprite(500, 500, "adil"); //load the player sprite
        adil.setScale(2); //fit the sprite to the background

        sultanate = this.physics.add
            .staticSprite(550, 375, "sultanate"); //load the player sprite
        sultanate.setScale(2); //fit the sprite to the background

        auryn = this.physics.add
            .staticSprite(400, 375, "auryn"); //load the player sprite
        auryn.setScale(2); //fit the sprite to the background
        auryn.setVisible(false);


        //#endregion

        amulet = this.physics.add.staticSprite(500, 375, 'amulet');
        amulet.setVisible(false);

        //#region add the necessary animations for everyone
        this.anims.create({
            key: 'backward',
            frames: this.anims.generateFrameNumbers('erian', { frames: [10] })
        })
        this.anims.create({
            key: 'adilbackward',
            frames: this.anims.generateFrameNumbers('adil', { frames: [10] })
        })
        this.anims.create({
            key: 'sultleft',
            frames: this.anims.generateFrameNumbers('sultanate', { frames: [4] })
        })
        this.anims.create({
                key: 'aurynright',
                frames: this.anims.generateFrameNumbers('auryn', { frames: [7] })
            })
            //#endregion


        text = this.add.text(player.body.position.x - 200, player.body.position.y + 100, 'Game Complete!');
        text.setVisible(false);

        this.cameras.main.once('camerafadeincomplete', function(camera) {
            text.setVisible(true);
            gameComplete = true;
        });

        this.cameras.main.fadeIn(12000);
    }

    update() {
        erian.anims.play('backward', true);
        adil.anims.play('adilbackward', true);
        sultanate.anims.play('sultleft', true);

        if (amuletPlaced != true) {
            setInterval(function() {
                amulet.setVisible(true);
                amuletPlaced = true;
            }, 2000);
        } else if (amuletPlaced = true) {
            auryn.anims.play('aurynright', true);
            setInterval(function() {
                auryn.setVisible(true);
            }, 3000);
        }

        if (gameComplete == true) {
            this.scene.switch("MainMenu");
        }
    }

}