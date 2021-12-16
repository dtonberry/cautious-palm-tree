import TILES from './tile-mapping.js';
import MainMenu from './intro.js';

let previousX;
let previousY;
let cursors;
let player;
let sultanate;
let adil;
let destin;
let erian;
let text;
let puzzleStart;

export default class HouseScene extends Phaser.Scene {
    constructor() {
        super("HouseScene");
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
    }

    create(data) {
        let camera = this.cameras.main; //initialize the camera

        previousX = parseInt(localStorage.getItem('playerX')) || 0;
        previousY = parseInt(localStorage.getItem('playerY')) || 0;

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
            .sprite(500, 250, "player"); //load the player sprite
        player.setScale(2); //fit the sprite to the background
        player.body.setCollideWorldBounds(true, 1, 1);
        player.setBounce(1);
        //#endregion

        //depending on which house was entered, change the sprites that appear.
        if (previousX <= 284 && previousX >= 234) {
            sultanate = this.physics.add
                .staticSprite(400, 300, "sultanate"); //load the player sprite
            sultanate.setScale(2); //fit the sprite to the background
        } else if (previousX <= 537 && previousX >= 487) {
            adil = this.physics.add
                .staticSprite(400, 300, "adil"); //load the player sprite
            adil.setScale(2); //fit the sprite to the background
        } else if (previousX <= 690 && previousX >= 650) {
            destin = this.physics.add
                .staticSprite(400, 300, "destin"); //load the player sprite
            destin.setScale(2); //fit the sprite to the background
            erian = this.physics.add
                .staticSprite(700, 300, "erian"); //load the player sprite
            erian.setScale(2); //fit the sprite to the background
        }

        //set up camera so that you can't move outside the tilemap
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        text = this.add.text(player.body.position.x - 200, player.body.position.y + 100, '');


        //we need some physics, can't have everyone overlapping
        furnitureLayer.setCollisionByProperty({ collides: true });
        baseLayer.setCollisionByProperty({ collides: true });
        //add collision for furniture layer
        let furnCollider = this.physics.add.collider(player, furnitureLayer, () => console.log("collided"), null, this);
        //add collision for base layer
        this.physics.add.collider(player, baseLayer, () => console.log("collided"), null, this);

        //#region sultanate interaction
        //this is an absolute mess!!
        this.physics.add.collider(player, sultanate, function() {
            if (player.body.touching.down && sultanate.body.touching.up ||
                player.body.touching.up && sultanate.body.touching.down ||
                player.body.touching.left && sultanate.body.touching.right ||
                player.body.touching.right && sultanate.body.touching.left) {
                if (cursors.space.isDown) {
                    text.setText("Thank you for heeding my call, brave knight. ")
                        .setPadding(30)
                        .setStyle({ backgroundColor: '#000000' })
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', SultanateDialog);
                }
            }
        });
        //#endregion

        //#region adil interaction
        this.physics.add.collider(player, adil, function() {
            if (player.body.touching.down && adil.body.touching.up ||
                player.body.touching.up && adil.body.touching.down ||
                player.body.touching.left && adil.body.touching.right ||
                player.body.touching.right && adil.body.touching.left) {
                if (cursors.space.isDown) {
                    text.setText("The winds change again, young Mathew.")
                        .setPadding(30)
                        .setStyle({ backgroundColor: '#000000' })
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', AdilDialog);
                }
            }
        });
        //#endregion
        this.physics.add.collider(player, destin, function() {
            if (player.body.touching.down && destin.body.touching.up ||
                player.body.touching.up && destin.body.touching.down ||
                player.body.touching.left && destin.body.touching.right ||
                player.body.touching.right && destin.body.touching.left) {
                if (cursors.space.isDown) {
                    text.setText("Have you been keeping up\nYour studies, Mathew?")
                        .setPadding(30)
                        .setStyle({ backgroundColor: '#000000' })
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', function() {
                            text.setText("")
                                .setPadding(0)
                                .setStyle({})
                        });
                }
            }
        });
        this.physics.add.collider(player, erian, function() {
            if (player.body.touching.down && erian.body.touching.up ||
                player.body.touching.up && erian.body.touching.down ||
                player.body.touching.left && erian.body.touching.right ||
                player.body.touching.right && erian.body.touching.left) {
                if (cursors.space.isDown) {
                    text.setText("Keeping your sword sharp\nI hope, Mathew.")
                        .setPadding(30)
                        .setStyle({ backgroundColor: '#000000' })
                        .setInteractive({ useHandCursor: true })
                        .on('pointerdown', function() {
                            text.setText("")
                                .setPadding(0)
                                .setStyle({})
                        });
                }
            }
        });

        //debug to check player hitbox
        // this.input.keyboard.once("keydown-D", event => {
        //     inventory.push("red")
        // });

        //check if player is at the door
        doorLayer.setTileIndexCallback(TILES.DOOR, () => {
            doorLayer.setTileIndexCallback(TILES.DOOR, null);
            camera.fade(250, 0, 0, 0);
            camera.once("camerafadeoutcomplete", () => {
                this.sound.stopAll();
                this.scene.stop("HouseScene");
                this.scene.run("TownScene");
            });
        });
        this.physics.add.overlap(player, doorLayer);


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
    }




    update() {
        player.body.setVelocity(0);

        text.setPosition(player.body.position.x - 200, player.body.position.y + 100);

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
            if (localStorage.getItem("QuestAccepted") == 0) {
                localStorage.setItem('PreviousScene', 'HouseScene')
                this.scene.switch("PlayGame");
                puzzleStart = false;
            }

        }
    }

}

//#region sultanate dialog
function SultanateDialog() {
    if (localStorage.getItem("QuestAccepted") == 1) {
        text.setText("You will find the amulet in the caves to the south")
            .setPadding(30)
            .setStyle({ backgroundColor: '#000000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', function() {
                text.setText("Please find it, brave knight!")
                    .setPadding(30)
                    .setStyle({ backgroundColor: '#000000' })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', function() {
                        text.setText("")
                            .setPadding(0)
                            .setStyle({})
                    })
            })
    } else {
        text.setText("You are to set out on a quest to find the Amulet of Justice.")
            .on('pointerdown', function() {
                text.setText(" With this amulet")
                    .on('pointerdown', function() {
                        text.setText("I will be able to bring my beloved back from the grave")
                            .on('pointerdown', function() {
                                text.setText("You will find the location to the amulet")
                                    .on('pointerdown', function() {
                                        text.setText("In this puzzle, please solve it.")
                                            .on('pointerdown', function() {
                                                text.setText("")
                                                    .setPadding(0)
                                                    .setStyle({})
                                                puzzleStart = true
                                            })
                                    })
                            })
                    })
            })
    }
}
//#endregion

//#region adil dialog
function AdilDialog() {
    if (localStorage.getItem("QuestAccepted") == 1) {
        text.setText("I heard the Sultanate is sending you")
            .setPadding(30)
            .setStyle({ backgroundColor: '#000000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', function() {
                text.setText("To the south cave.")
                    .setPadding(30)
                    .setStyle({ backgroundColor: '#000000' })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerdown', function() {
                        text.setText("Please becareful.")
                            .setPadding(30)
                            .setStyle({ backgroundColor: '#000000' })
                            .setInteractive({ useHandCursor: true })
                            .on('pointerdown', function() {
                                text.setText("")
                                    .setPadding(0)
                                    .setStyle({})
                            })
                    })
            })
    } else {
        text.setText("As the Elder of this small village")
            .on('pointerdown', function() {
                text.setText("It is my duty to keep you all safe")
                    .on('pointerdown', function() {
                        text.setText("If you need anything")
                            .on('pointerdown', function() {
                                text.setText("Let me know!")
                                    .on('pointerdown', function() {
                                        text.setText("")
                                            .setPadding(0)
                                            .setStyle({})
                                    })
                            })
                    })
            })
    }
}
//#endregion