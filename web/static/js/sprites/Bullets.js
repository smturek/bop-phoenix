export class Bullets extends Phaser.Group {
    constructor(state, isPlayer) {
        super(state.game);

        this.state = state;
        this.game = state.game;
        this.player = state.player;
        this.isPlayer = isPlayer;
        this.asset = 'bullet';
        this.TIMER = 0;

        console.log(state)
    }
    fire(direction) {
            if (this.state.time.now > this.TIMER) {
                //see if there is an unused bullet in the bullet pool
                var bullet = this.getFirstExists(false),
                bullet2;

                if (!bullet) {
                    //create a bullet if there is no bullet found in the group
                    bullet = new Phaser.Sprite(this.game, this.player.x, this.player.y, this.asset);
                    this.game.physics.arcade.enable(bullet);
                    bullet.anchor.setTo(0.5);
                    this.add(bullet);
                }
                else {
                    //reset dead bullet
                    bullet.reset(this.player.x, this.player.y);
                }

                //create other bullets if the player has the appropriate powerups
                if(this.isPlayer && this.player.powerUps.doubleShot) {
                    bullet2 = this.getFirstExists(false);

                    if (!bullet2) {
                        //create a bullet if there is no bullet found in the group
                        if(direction == 'up' || direction == 'down') {
                            bullet2 = new Phaser.Sprite(this.game, this.player.x + 8, this.player.y, this.asset);
                        }
                        else if(direction == 'right' || direction == 'left') {
                            bullet2 = new Phaser.Sprite(this.game, this.player.x, this.player.y  + 8, this.asset);
                        }

                        this.game.physics.arcade.enable(bullet2);
                        bullet2.anchor.setTo(0.5);
                        this.add(bullet2);
                    }
                    else {
                        //reset dead bullet
                        if(direction == 'up' || direction == 'down') {
                            bullet2.reset(this.player.x + 8, this.player.y);
                        }
                        else if(direction == 'right' || direction == 'left') {
                            bullet2.reset(this.player.x, this.player.y + 8);
                        }
                    }

                    //fix position of bullet
                    if(direction == 'up' || direction == 'down') {
                        bullet.x -= 8;
                    }
                    else if(direction == 'right' || direction == 'left') {
                        bullet.y -= 8;
                    }
                }

                //set direction for bullet to travel
                if(direction == "up") {
                    bullet.body.velocity.y = -400;

                    if(bullet2){
                        bullet2.body.velocity.y = -400;
                    }
                }

                else if(direction == "down") {
                  bullet.body.velocity.y = 400;

                  if(bullet2){
                      bullet2.body.velocity.y = 400;
                  }
                }

                else if(direction == "right") {
                  bullet.body.velocity.x = 400;

                  if(bullet2){
                      bullet2.body.velocity.x = 400;
                  }
                }

                else if(direction == "left") {
                  bullet.body.velocity.x = -400;

                  if(bullet2){
                      bullet2.body.velocity.x = -400;
                  }
                }

                //reset timer for next shot
                this.TIMER = this.state.time.now + this.state.PLAYER_FIRING_RATE;
            }
    }
}
