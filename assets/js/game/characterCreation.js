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
        scene: [MainMenu, IntroScene, TownScene, PlayGame]
    }
    game = new Phaser.Game(config);
    window.focus();
}

export default class CharacterCreation extends Phaser.scene {
    preload() {

    }

    create() {

    }

    update() {

    }
}