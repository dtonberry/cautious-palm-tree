import TILES from './tile-mapping.js';

let player;
let carys;
let game;
let cursors;
let tmap;
let text;
let puzzleStart = false;

export default class DungeonMap3 extends Phaser.Scene {
    constructor() {
        super("DungeonMap3");
    }

    preload() {

        //lets load the scene JSON
        this.load.image('dungeon_base_tiles', '../PhaserEditor Files/assets/MainLev2.0.png');
        this.load.image('amulet', '../assets/sprites/amulet.png');
        this.load.tilemapTiledJSON('dungeonmap3', '../PhaserEditor Files/assets/finaldungeon.json');
    }

    create() {
        let camera = this.cameras.main; //initialize the camera

        //create corrolation between up, down, left and right keys with the addition of space and shift and game
        cursors = this.input.keyboard.createCursorKeys();

        let music = this.sound.play('dungeon', { loop: true });

        tmap = this.make.tilemap({ key: 'dungeonmap3' });
        let tileset = tmap.addTilesetImage('MainLev2.0', 'dungeon_base_tiles');

        this.physics.world.setFPS(30);
        this.physics.world.setBounds(0, 0, tmap.x, camera.y - tmap.y);

        //create layers
        let groundLayer = tmap.createLayer('ground layer', tileset, 125, 50);
        let walls = tmap.createLayer('wall layer', tileset, 125, 50);

        //create the key
        let amulet = this.physics.add.staticSprite(250, 150, 'amulet');

        //#region player
        player = this.physics.add
            .sprite(200, 150, "player"); //load the player sprite
        player.setScale(1); //fit the sprite to the background
        player.body.setCollideWorldBounds(true, 1, 1);
        player.setBounce(1);
        //#endregion

        text = this.add.text(player.body.position.x - 100, player.body.position.y + 100, '');

        //set up camera so that you can't move outside the tilemap
        camera.startFollow(player);
        camera.setBounds(0, 0, tmap.widthInPixels, tmap.heightInPixels);
        camera.zoom = 2;

        //lets make some colliders so we can stay inside the confines of the map
        walls.setCollisionByProperty({ collides: true });
        this.physics.add.collider(player, walls);

        //if player zones, bring them to the correct map
        groundLayer.setTileIndexCallback(TILES.CAVEENTRANCE, () => {
            groundLayer.setTileIndexCallback(TILES.CAVEENTRANCE, null);
            if (player.body.position.x == 189) {
                camera.fade(250, 0, 0, 0);
                camera.once("camerafadeoutcomplete", () => {
                    this.sound.stopAll();
                    this.scene.sleep("DungeonMap3");
                    this.scene.start("DungeonMap2", this);
                });
            }

        });


        this.physics.add.collider(player, amulet, function() {
            if (player.body.touching.down && amulet.body.touching.up ||
                player.body.touching.up && amulet.body.touching.down ||
                player.body.touching.left && amulet.body.touching.right ||
                player.body.touching.right && amulet.body.touching.left) {
                if (cursors.space.isDown) {
                    text.setText("The amulet is locked to the ground with a puzzle")
                        .setPadding(30)
                        .setScale(0.5)
                        .setStyle({ backgroundColor: '#000000' })
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', function() {
                            if (localStorage.getItem('QuestAccepted') == 5) {
                                localStorage.setItem('QuestAccepted', 6);
                                amulet.setVisible(false);
                                puzzleStart = true;
                                text.setText("")
                                    .setPadding()
                                    .setStyle({})
                            } else {
                                text.setText("")
                                    .setPadding()
                                    .setStyle({})
                            }
                        });
                }
            }
        });

        this.physics.add.overlap(player, groundLayer);

    }

    update() {
        player.body.setVelocity(0);

        text.setPosition(player.body.position.x - 100, player.body.position.y + 100);

        if (cursors.space.isDown) {
            console.log(player.body.position.x, player.body.position.y);
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

        if (puzzleStart == true) {
            if (localStorage.getItem('QuestAccepted') == 6) {
                this.scene.switch('PlayGame');
                localStorage.setItem('PreviousScene', 'DungeonMap3');
            }
        }

    }
}