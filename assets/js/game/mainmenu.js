import TownScene from "./townscene.js";
import IntroScene from "./intro.js";
import PlayGame from './puzzleScene.js';

let config;
let game;


function startGame() {
    game.scene.remove("MainMenu"); //remove (destroy) the open main menu scene
    game.scene.start(PlayGame); //open the new intro scene
}


class MainMenu extends Phaser.Scene {

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
export default MainMenu;