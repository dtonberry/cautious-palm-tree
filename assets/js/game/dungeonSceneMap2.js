import TILES from './tile-mapping.js';

let player;
let carys;
let game;
let cursors;
let tmap;
let text;
let puzzleStart = false;

export default class DungeonMap2 extends Phaser.Scene {
    constructor() {
        super("DungeonMap2");
    }

    preload() {
        //add the player spritesheet
        this.load.spritesheet('player', '../assets/sprites/characterSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            frames: 12
        });

        //lets load the scene JSON
        this.load.image('dungeon_base_tiles', '../PhaserEditor Files/assets/MainLev2.0.png');
        this.load.image('key', '../assets/sprites/key.png');
        this.load.tilemapTiledJSON('dungeonmap2', '../PhaserEditor Files/assets/dungeonMap2.json');
    }

    create() {
        let camera = this.cameras.main; //initialize the camera

        //create corrolation between up, down, left and right keys with the addition of space and shift and game
        cursors = this.input.keyboard.createCursorKeys();

        let music = this.sound.play('dungeon', { loop: true });

        tmap = this.make.tilemap({ key: 'dungeonmap2' });
        let tileset = tmap.addTilesetImage('MainLev2.0', 'dungeon_base_tiles');

        this.physics.world.setFPS(30);
        this.physics.world.setBounds(0, 0, tmap.x, camera.y - tmap.y);

        //create layers
        let groundLayer = tmap.createLayer('Floor Layer', tileset, 0, 0);
        let walls = tmap.createLayer('Wall Layer', tileset, 0, 0);

        //create the key
        let key = this.physics.add.staticSprite(309, 415, 'key');

        //#region player
        player = this.physics.add
            .sprite(704, 748, "player"); //load the player sprite
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
            if (player.body.position.x == 704) {
                camera.fade(250, 0, 0, 0);
                camera.once("camerafadeoutcomplete", () => {
                    this.sound.stopAll();
                    this.scene.sleep("DungeonMap2");
                    this.scene.start("DungeonMap1", this);
                });
            } else if (localStorage.getItem('QuestAccepted') == 5 && player.body.position.x >= 48 && player.body.position.x <= 80) {
                camera.fade(250, 0, 0, 0);
                camera.once("camerafadeoutcomplete", () => {
                    this.sound.stopAll();
                    this.scene.sleep("DungeonMap2");
                    this.scene.start("DungeonMap3", this);
                });
            }

        });


        this.physics.add.collider(player, key, function() {
            if (player.body.touching.down && key.body.touching.up ||
                player.body.touching.up && key.body.touching.down ||
                player.body.touching.left && key.body.touching.right ||
                player.body.touching.right && key.body.touching.left) {
                if (cursors.space.isDown) {
                    text.setText("The key is locked to the ground with a puzzle")
                        .setPadding(30)
                        .setScale(0.5)
                        .setStyle({ backgroundColor: '#000000' })
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', function() {
                            if (localStorage.getItem('QuestAccepted') == 3) {
                                localStorage.setItem('QuestAccepted', 4);
                                key.setVisible(false);
                                puzzleStart = true;
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
        if (localStorage.getItem('QuestAccepted') == 4) {
            this.scene.switch("PlayGame");
        }

    }
}