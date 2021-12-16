let sultanate;
let game;
let config;
let isClickable = false;
let text;
let cursors;
let player;
let mysteryStanger;


export default class IntroCutscene extends Phaser.Scene {
    constructor() {
        super('IntroCutscene');
    }

    preload() {
        //#region maps and layers
        this.load.setPath('../assets/sprites/Intro Cutscene/');
        this.load.image('background', 'Layer_0010_1.png');
        this.load.image('secondBackground', 'Layer_0011_0.png');
        this.load.image('treeBackground', 'Layer_0009_2.png');
        this.load.image('treeBackground2', 'Layer_0008_3.png');
        this.load.image('lightBackground', 'Layer_0007_Lights.png');
        this.load.image('treeBackground3', 'Layer_0006_4.png');
        this.load.image('treeBackground4', 'Layer_0005_5.png');
        this.load.image('light2', 'Layer_0004_Lights.png');
        this.load.image('treeBackground5', 'Layer_0003_6.png');
        this.load.image('treetops', 'Layer_0002_7.png');
        this.load.image('grassForeground', 'Layer_0001_8.png');
        this.load.image('grassForeground2', 'Layer_0000_9.png');
        //#endregion

        //#region import sultanate and stranger
        this.load.spritesheet('sultanate', '../Player Sprites/sultanate.png', {
            frameWidth: 32,
            frameHeight: 32,
            frames: 12
        }); //this loads our character spritesheet
    }


    create() {
        //#region create background
        let background = this.physics.add.sprite(400, 300, 'background');
        let secondBackground = this.physics.add.sprite(400, 300, 'secondBackground');
        let treeBackground = this.physics.add.sprite(400, 200, 'treeBackground');
        let treeBackground2 = this.physics.add.sprite(400, 200, 'treeBackground2');
        let treeBackground3 = this.physics.add.sprite(400, 200, 'treeBackground3');
        let treeBackground4 = this.physics.add.sprite(400, 200, 'treeBackground4');
        let treeBackground5 = this.physics.add.sprite(400, 200, 'treeBackground5');
        let treetops = this.physics.add.sprite(400, 200, 'treetops');
        let grassForeground = this.physics.add.sprite(400, 203, 'grassForeground');
        let grassForeground2 = this.physics.add.sprite(400, 203, 'grassForeground2');
        //#endregion

        let audio = this.sound.play('gloom');

        //add sultanate and mysterious stranger
        sultanate = this.physics.add.sprite(0, 500, 'sultanate');
        sultanate.setScale(2);

        //create corrolation between up, down, left and right keys with the addition of space and shift and game
        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(sultanate, grassForeground);

        text = this.add.text(400, 300, '');

        //#region animations
        //set some animations

        //move forward animation

        let walkForward = this.anims.create({
            key: 'forward',
            frames: this.anims.generateFrameNumbers('sultanate', { frames: [10] })
        })

        //move back animation
        let walkBackward = this.anims.create({
            key: 'backward',
            frames: this.anims.generateFrameNumbers('sultanate', { frames: [0, 1, 2, 1, 0] })
        })

        //move left animation
        let walkLeft = this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('sultanate', { frames: [3, 4, 5, 4, 3] })
        })

        //move right animation
        let walkRight = this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('sultanate', { frames: [6, 7, 8, 7, 6] })
            })
            //#endregion


    }




    update() {
        cutsceneScript();
        if (sultanate.body.position.x >= 400) {
            this.sound.stopAll();
            this.scene.remove("IntroCutscene", true, true);
            this.scene.start("IntroScene", true, true);
            this.cameras.main.fadeIn(2000);
        }
    }
}

function cutsceneScript() {
    //open with the sultanate walking on to the screen

    if (sultanate.body.position.x != 150) {
        sultanate.body.setVelocityX(20);
        sultanate.anims.play('right', true);
        sultanate.anims.msPerFrame = 200;
    } else {
        firstStop();
    }

    if (sultanate.body.position.x >= 200) {
        secondStop();
    }
    if (sultanate.body.position.x >= 300) {
        text.setText("I am coming for you");
    }



}

function firstStop() {
    sultanate.body.setVelocityX(0);
    sultanate.anims.play('forward', true);
    sultanate.anims.msPerFrame = 0;
    text.setText('I wish you were here')
    setInterval(() => {
        sultanate.body.setVelocityX(20);
        sultanate.anims.play('right', true);
        sultanate.anims.msPerFrame = 200;
        text.setText('I will find you')
    }, 3000);
}

function secondStop() {
    sultanate.body.setVelocityX(20);
    sultanate.anims.play('right', true);
    sultanate.anims.msPerFrame = 200;
    text.setText('No matter what it takes')
}

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}