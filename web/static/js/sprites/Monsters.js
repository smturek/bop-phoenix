export class Monsters extends Phaser.Sprite {
    constructor(state, x, y, asset) {
        super(state.game, x, y, asset)

        this.state = state;
        this.game = state.game;
        this.shotTimer = 0;
        this.BULLET_SPEED = 100

        //init physics body
        this.game.physics.arcade.enable(this);
    }
    update() {
        if (this.game.time.now > this.shotTimer) {
            this.fire();
            this.shotTimer = this.game.time.now + this.state.MONSTER_FIRING_RATE;
        }
    }
    fire() {
        if(this.alive) {
            let bullet = this.state.monsterBullets.getFirstExists(false);

            if (!bullet) {
                //create a bullet if there is no bullet found in the group
                bullet = new Phaser.Sprite(this.game, this.x + 8, this.y + 8, 'monsterBullet');
                this.game.physics.arcade.enable(bullet);
                bullet.anchor.setTo(0.5);
                this.state.monsterBullets.add(bullet);
            }
            else {
                //reset dead bullet
                bullet.reset(this.x, this.y);
            }

            this.game.physics.arcade.moveToObject(bullet, this.state.player, this.BULLET_SPEED);
        }
    }
}
