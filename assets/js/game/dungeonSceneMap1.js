import TILES from './tile-mapping.js';

let player;
let carys;
let game;
let cursors;
let tmap;
let text;
let puzzleStart;

export default class DungeonMap1 extends Phaser.Scene {
    constructor() {
        super("DungeonMap1");
    }

    preload() {
        //add the player spritesheet
        this.load.spritesheet('player', '../assets/sprites/characterSpritesheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            frames: 12
        });

        this.load.spritesheet('carys', '../assets/sprites/Player Sprites/carys.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        });

        //lets load the scene JSON
        this.load.image('dungeon_base_tiles', '../PhaserEditor Files/assets/MainLev2.0.png');
        this.load.image('dungeon_base_tiles2', '../PhaserEditor Files/assets/LedC.png');
        this.load.image('dungeon_base_tiles3', '../PhaserEditor Files/assets/decorative.png');
        this.load.tilemapTiledJSON('dungeonmap', '../PhaserEditor Files/assets/dungeonMap1.json');
    }

    create() {
        let camera = this.cameras.main; //initialize the camera

        //create corrolation between up, down, left and right keys with the addition of space and shift and game
        cursors = this.input.keyboard.createCursorKeys();

        let music = this.sound.play('dungeon', { loop: true });

        tmap = this.make.tilemap({ key: 'dungeonmap' });
        let dungeonbasetiles3 = tmap.addTilesetImage('decorative', 'dungeon_base_tiles3');
        let dungeonbasetiles2 = tmap.addTilesetImage('LedC', 'dungeon_base_tiles2');
        let dungeonbasetiles = tmap.addTilesetImage('MainLev2.0', 'dungeon_base_tiles');

        this.physics.world.setFPS(30);
        this.physics.world.setBounds(0, 0, tmap.x, camera.y - tmap.y);

        //create layers
        let groundLayer = tmap.createLayer('ground layer', [dungeonbasetiles, dungeonbasetiles2, dungeonbasetiles3], 0, 0);
        let walls = tmap.createLayer('walls', [dungeonbasetiles, dungeonbasetiles2, dungeonbasetiles3], 0, 0);
        let extras = tmap.createLayer('Extras', [dungeonbasetiles, dungeonbasetiles2, dungeonbasetiles3], 0, 0);

        //#region player
        player = this.physics.add
            .sprite(1450, 800, "player"); //load the player sprite
        player.setScale(1); //fit the sprite to the background
        player.body.setCollideWorldBounds(true, 1, 1);
        player.setBounce(1);
        //#endregion

        text = this.add.text(player.body.position.x - 200, player.body.position.y + 100, '');

        //if quest is accepted, spawn Carys
        carys = this.physics.add.staticSprite(700, 450, 'carys');

        //set up camera so that you can't move outside the tilemap
        camera.startFollow(player);
        camera.setBounds(0, 0, tmap.widthInPixels, tmap.heightInPixels);
        camera.zoom = 2;

        //lets make some colliders so we can stay inside the confines of the map
        walls.setCollisionByProperty({ collides: true });
        groundLayer.setCollisionByProperty({ collides: true });
        extras.setCollisionByProperty({ collides: true });
        this.physics.add.collider(player, walls);
        this.physics.add.collider(player, extras);

        //carys interaction
        this.physics.add.collider(player, carys, function() {
            if (player.body.touching.down && carys.body.touching.up ||
                player.body.touching.up && carys.body.touching.down ||
                player.body.touching.left && carys.body.touching.right ||
                player.body.touching.right && carys.body.touching.left) {
                if (cursors.space.isDown) {
                    text.setText("Hmm? I'm busy, leave me alone.")
                        .setPadding(30)
                        .setScale(0.5)
                        .setStyle({ backgroundColor: '#000000' })
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', function() {
                            if (localStorage.getItem('QuestAccepted') >= 1) {
                                CarysDialog();
                            }
                        });
                }
            }
        });

        //if player zones, bring them to the correct map
        walls.setTileIndexCallback(TILES.CAVEENTRANCE, () => {
            walls.setTileIndexCallback(TILES.CAVEENTRANCE, null);
            if (player.body.position.x == 1434) {
                camera.fade(250, 0, 0, 0);
                camera.once("camerafadeoutcomplete", () => {
                    this.sound.stopAll();
                    this.scene.sleep("DungeonMap1");
                    this.scene.start("TownScene");
                });
            } else if (localStorage.getItem('QuestAccepted') >= 3 && player.body.position.x >= 224 && player.body.position.x <= 288) {
                camera.fade(250, 0, 0, 0);
                camera.once("camerafadeoutcomplete", () => {
                    this.sound.stopAll();
                    this.scene.sleep("DungeonMap1");
                    this.scene.start("DungeonMap2");
                });
            }
        });

    }

    update() {
        player.body.setVelocity(0);

        text.setPosition(player.body.position.x, player.body.position.y + 100);

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
            if (localStorage.getItem('QuestAccepted') == 2) {
                this.scene.switch('PlayGame');
                localStorage.setItem('PreviousScene', 'DungeonMap1');
            }
        }

    }
}

function CarysDialog() {
    if (localStorage.getItem('QuestAccepted') == 1) {
        text.setText('')
            .setStyle({})
            .setPadding(0);
        localStorage.setItem('QuestAccepted', 2);
        puzzleStart = true;
    } else if (localStorage.getItem("QuestAccepted") == 3) {
        text.setText("You will find the amulet in the next room")
            .setPadding(30)
            .setStyle({ backgroundColor: '#000000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', function() {
                text.setText("Go take your plunder!")
                    .setPadding(30)
                    .setStyle({ backgroundColor: '#000000' })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', function() {
                        text.setText("")
                            .setPadding(0)
                            .setStyle({})
                    })
            })
    }
}