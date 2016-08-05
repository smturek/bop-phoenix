export class Boot extends Phaser.State {
    init() {
        this.game.stage.backgroundColor = '#000';
        this.game.stage.disableVisibilityChange = true;
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    preload() {
        this.load.image('preloadbar', 'images/pink.png');
    }

    create() {
        this.state.start('preload');
    }
}
