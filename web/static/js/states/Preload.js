export class Preload extends Phaser.State {
    preload() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(2);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('wall', 'images/wall.png');
        this.load.image('exit', 'images/exit.png');
        this.load.image('monster', 'images/monster.png');
        this.load.image('blastMonster', 'images/blastmonster.png');
        this.load.image('monster2', 'images/monster2.png');
        this.load.image('monster3', 'images/monster3.png');
        this.load.image('boss', 'images/boss.png');
        this.load.image('bullet', 'images/bullet.png');
        this.load.image('monsterBullet', 'images/ebullet.png');
        this.load.image('powerUp', 'images/powerup.png');
        this.load.image('lifeUp', 'images/lifeup.png');

        this.load.spritesheet('player', 'images/player.png', 20, 20, 2);
        this.load.spritesheet('life', 'images/life.png', 16, 16, 2);

    }
    create() {
        this.state.start('menu');
    }
}
