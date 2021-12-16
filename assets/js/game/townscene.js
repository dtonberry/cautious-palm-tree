import TILES from './tile-mapping.js';

//#region world properties
let player;
let anims;
let cursors;
let game;
let config;
let rand;
let previousX;
let previousY;
let questAccepted;
//#endregion

//-------------------CONFIG------------------------
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
                }
            },
            antialias: true,
            pixelArt: true,
            Scene: [TownScene]
        }

        game = new Phaser.Game(config);
        window.focus();
    }
    //------------------END CONFIG----------------------

export default class TownScene extends Phaser.Scene {
    constructor() {
        super("TownScene");
    }

    preload() {
        //load our sprites
        this.load.spritesheet('player', '../assets/sprites/characterSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            frames: 12
        });

        //add ui menu
        this.load.image('ui_menu', "../assets/images/uiMain.png");

        //lets load the scene JSON
        this.load.image('snow_base_tiles', '../PhaserEditor Files/assets/!CL_DEMO.png');
        this.load.tilemapTiledJSON('snowmap', '../PhaserEditor Files/assets/townscene.json');
    }

    create() {
        let camera = this.cameras.main; //initialize the camera

        previousX = parseInt(localStorage.getItem('playerX')) || 0;
        previousY = parseInt(localStorage.getItem('playerY')) || 0;

        //create corrolation between up, down, left and right keys with the addition of space and shift and game
        cursors = this.input.keyboard.createCursorKeys();

        this.sound.play('town', { loop: true });

        //load the scene
        let map = this.make.tilemap({ key: 'snowmap' });
        let tileset = map.addTilesetImage('!CL_DEMO', 'snow_base_tiles');

        //set world FPS to 30 so we don't use too much CPU resources
        //also set the world bounds to the edge of the camera for the sake of redundancy
        this.physics.world.setFPS(30);
        this.physics.world.setBounds(0, 0, map.x, camera.y - map.y);

        //we need to extract all of the different layers and set them on our scene
        let groundLayer = map.createLayer('ground layer', tileset, 0, 0);
        let decorationLayer = map.createLayer('decoration layer', tileset, 0, 0);
        let houseLayer = map.createLayer('house layer', tileset, 0, 0);
        let doorLayer = map.createLayer('door layer', tileset, 0, 0);

        //spawn in the player
        player = this.physics.add
            .sprite(400, 600, "player");
        player.body.setCollideWorldBounds(true, 1, 1);
        player.setBounce(1);

        //camera follow player
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.zoom = 2;

        //add collisions
        decorationLayer.setCollisionByProperty({ collides: true });
        groundLayer.setCollisionByProperty({ collides: true });
        houseLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(player, houseLayer, () => console.log("collided"), null, this);
        this.physics.add.collider(player, groundLayer);
        this.physics.add.collider(player, decorationLayer);

        //check if player is at a door
        doorLayer.setTileIndexCallback(TILES.DOOR, () => {
            doorLayer.setTileIndexCallback(TILES.DOOR, null);
            camera.fade(250, 0, 0, 0);
            camera.once("camerafadeoutcomplete", () => {
                this.scene.sleep("TownScene");
                this.scene.start("HouseScene", this);
            });
        });
        //check if the player is on the tile for cave entrace
        decorationLayer.setTileIndexCallback(TILES.CAVEENTRANCE, () => {
            decorationLayer.setTileIndexCallback(TILES.CAVEENTRANCE, null);
            camera.fade(250, 0, 0, 0);
            camera.once("camerafadeoutcomplete", () => {
                this.sound.stopAll();
                this.scene.sleep("TownScene");
                this.scene.start("DungeonMap1", this);
            });
        });
        this.physics.add.overlap(player, doorLayer, () => {
            localStorage.setItem('playerX', player.body.position.x);
            localStorage.setItem('playerY', player.body.position.y);
        });
        this.physics.add.overlap(player, decorationLayer);




    }

    update() {
        player.body.setVelocity(0);

        //if spacebar is pressed
        if (cursors.space.isDown) {
            console.log(previousX, previousY);
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