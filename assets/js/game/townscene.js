import TILES from './tile-mapping.js';

//#region world properties
let player;
let anims;
let cursors;
let game;
let config;
let rand;
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
                    tileBias: 48
                }
            },
            antialias: false,
            pixelArt: true,
            Scene: [TownScene]
        }

        game = new Phaser.Game(config);
        window.focus();
    }
    //------------------END CONFIG----------------------

class TownScene extends Phaser.Scene {
    constructor() {
        super("TownScene");
    }

    preload() {
        //load our sprites
        this.load.spritesheet('player', '../assets/sprites/characterSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            frames: 24
        });

        //add ui menu
        this.load.image('ui_menu', "../assets/images/uiMain.png");

        //lets load the scene JSON
        this.load.image('base_tiles', '../PhaserEditor Files/assets/!CL_DEMO_48x48.png');
        this.load.tilemapTiledJSON('map', '../PhaserEditor Files/assets/townscene.json');
    }

    create() {
        let camera = this.cameras.main; //initialize the camera

        //create corrolation between up, down, left and right keys with the addition of space and shift and game
        cursors = this.input.keyboard.createCursorKeys();

        //add the ui screen
        const ui = this.add.sprite(400, 400, 'ui_menu');

        //load the scene
        let map = this.make.tilemap({ key: 'map' });
        let tileset = map.addTilesetImage('!CL_DEMO_48x48', 'base_tiles');

        //set world FPS to 30 so we don't use too much CPU resources
        //also set the world bounds to the edge of the camera for the sake of redundancy
        this.physics.world.setFPS(30);
        this.physics.world.setBounds(0, 0, map.x, camera.y - map.y);

        //we need to extract all of the different layers and set them on our scene
        let baseLayer = map.createLayer('base layer', tileset, 0, 0);
        let grassLayer = map.createLayer('grass layer', tileset, 0, 0);
        let houseLayer = map.createLayer('house layer', tileset, 0, 0);
        let doorLayer = map.createLayer('door layer', tileset, 0, 0);

        //spawn in the player
        player = this.physics.add
            .sprite(400, 450, "player");
        player.setScale(3);
        player.body.setCollideWorldBounds(true, 1, 1);
        player.setBounce(1);

        //camera follow player
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //add collisions
        houseLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(player, houseLayer, () => console.log("collided"), null, this);

        //random encounter in grass
        this.physics.add.overlap(player, grassLayer, this.enemyEncounter, null, this);
        grassLayer.setTileIndexCallback(TILES.GRASS, () => {
            grassLayer.setTileIndexCallback(TILES.GRASS, null);
            console.log(this.rand);

        });

        //check if player is at a door
        doorLayer.setTileIndexCallback(TILES.DOOR, () => {
            doorLayer.setTileIndexCallback(TILES.DOOR, null);
            camera.fade(250, 0, 0, 0);
            camera.once("camerafadeoutcomplete", () => {
                this.scene.stop("TownScene");
                this.scene.start("IntroScene");
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

    enemyEncounter() {
        rand = Math.floor(Math.random * 100);
    }
}
export default TownScene;