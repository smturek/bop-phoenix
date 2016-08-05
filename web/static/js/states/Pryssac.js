import {Bullets} from "../sprites/Bullets"
import {renderPlayers, renderUI, renderWalls, renderMonsters} from "../sprites/Render"
import {createSprite} from "../common/sprites"
import {sharePosition, receivePosition, serializePosition, generateMonsters, killMonster} from "../common/sync"

export class Pryssac extends Phaser.State {
    init(...options) {
        console.log("OPTIONS", options);
        const [channel, {id, players, monsters}] = options;
        this.channel = channel;
        this.id = id
        this.players = players
        this.serverMonsters = monsters

        console.log("SERVER MONSTERS", monsters)

        this.PLAYER_MAX_LIFE = 3;
        this.PLAYER_FIRING_RATE = 300;
        this.MONSTER_FIRING_RATE = 1200;
        this.TILE_WIDTH = 16;
        this.TILE_HEIGHT = 16;
        this.CHANCE_OF_MONSTER = 0.005;
        this.LEVEL_ROWS = 34;
        this.LEVEL_COLS = 58;

        this.killCount = 0;

        //Level generation
        this.levelNumber = 1;

        //input keys
        this.keys = this.game.input.keyboard.createCursorKeys();
        this.moveUp = this.game.input.keyboard.addKey(87);
        this.moveDown = this.game.input.keyboard.addKey(83);
        this.moveLeft = this.game.input.keyboard.addKey(65);
        this.moveRight = this.game.input.keyboard.addKey(68);
    }
    create() {
        //monsters
        generateMonsters(this.levelNumber, this.channel)

        //groups and sprites
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.walls = this.add.group();
        this.playerBullets = new Bullets(this, true);
        this.monsterBullets = this.add.group();
        this.monsters = this.add.group();
        this.otherPlayers = this.add.group();
        this.lives = this.add.group();
        this.drops = this.add.group();
        this.tutorials = this.add.group();

        //text blocks
        this.deathText = this.add.text(this.game.world.centerX, this.game.world.centerY - 100, "", {fontSize: 48, fill: 'white'});
        this.deathText.anchor.setTo(0.5);
        this.killsText = this.add.text(this.game.world.centerX, this.game.world.centerY, "", {fontSize: 32, fill: 'white'});
        this.killsText.anchor.setTo(0.5);
        this.restartText = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, "", {fontSize: 24, fill: 'white'});
        this.restartText.anchor.setTo(0.5);
        this.announcementText = this.add.text(this.game.world.centerX, 50, "", {fontSize: 24, fill: 'white'});
        this.announcementText.anchor.setTo(0.5);

        //channel listeners
        this.channel.on("player:join", (player) => {
            console.log("a player has joined your game!")
            const sprite = createSprite(this.game, player);
            receivePosition(sprite, this.channel)
            this.otherPlayers.add(sprite)
        })

        this.channel.on("monsters:send", (payload) => {
            this.serverMonsters = payload.monsters
        })

        //rendering
        renderUI(this)
        renderPlayers(this)
        renderWalls(this)
        renderMonsters(this)


        //brings player back to top level so other sprites don't cover it
        this.player.bringToTop();
    }
    update() {
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        //collisions
        this.game.physics.arcade.collide(this.player, this.walls);
        this.game.physics.arcade.collide(this.player, this.monsters);
        this.game.physics.arcade.overlap(this.player, this.exit, this.nextLevel, null, this);
        this.game.physics.arcade.overlap(this.player, this.drops, this.pickUp, null, this);
        this.game.physics.arcade.collide(this.player, this.monsterBullets, this.hitPlayer, null, this);
        this.game.physics.arcade.collide(this.monsters, this.playerBullets, this.hitMonster, null, this);
        this.game.physics.arcade.overlap(this.walls, this.playerBullets, this.killBullet);
        this.game.physics.arcade.overlap(this.walls, this.monsterBullets, this.killBullet);

        this.movePlayer()
    }

    movePlayer() {
        if(this.player.alive) {
            if (this.moveUp.isDown) {
                this.player.body.velocity.y -= 250;
            }
            else if (this.moveDown.isDown) {
                this.player.body.velocity.y += 250;
            }
            else if (this.moveRight.isDown) {
                this.player.body.velocity.x += 250;
            }
            else if (this.moveLeft.isDown) {
                this.player.body.velocity.x -= 250;
            }

            if (this.keys.left.isDown) {
                this.playerBullets.fire("left");
            }
            else if (this.keys.right.isDown) {
                this.playerBullets.fire("right");
            }
            else if (this.keys.up.isDown) {
                this.playerBullets.fire("up");
            }
            else if (this.keys.down.isDown) {
                this.playerBullets.fire("down");
            }
        }
    }

    killBullet(wall, bullet) {
        bullet.kill();
    }

    addExit() {
        this.exit = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'exit');
        this.game.physics.arcade.enable(this.exit);
    }

    hitPlayer(player, bullet) {
        bullet.kill();

        let life = this.lives.getFirstAlive();

        if(life) {
            life.kill();
        }

        if (this.lives.countLiving() < 1) {
            player.kill();
            player.visible = true;
            player.frame = 1;

            this.gameOver();
        }
    }

    hitMonster(monster, bullet) {
        bullet.kill();
        monster.damage(1);

        if(monster.health === 0) {
            this.killCount++;
            killMonster(monster.id, this.channel);
            var rand = this.game.rnd.integerInRange(0, 10);
            var drop;
            if(rand < 1 && (!this.player.powerUps.doubleShot || !this.player.powerUps.doubleSpeed)) {
                drop = this.add.sprite(monster.x, monster.y, "powerUp");
                this.game.physics.arcade.enable(drop);
                drop.body.immovable = true;
                this.drops.add(drop);
            }
            else if(rand < 8) {
                drop = this.add.sprite(monster.x, monster.y, "lifeUp");
                this.game.physics.arcade.enable(drop);
                drop.body.immovable = true;
                this.drops.add(drop);
            }
        }

        // check to see if it was the last monster, and if so add exit
        if(!this.monsters.getFirstAlive()) {
            this.addExit();
        }
    }

    gameOver() {
        this.player.sendToBack();

        this.deathText.text = "YOU'RE DEAD!";
        this.killsText.text = "YOU KILLED " + this.killCount + " MONSTERS";
        // this.restartText.text = "Click anywhere to return to the main menu";
        //
        // this.game.input.onTap.addOnce(this.restart);
    }

    nextLevel() {
        this.exit.kill();
        this.drops.callAll('kill')
        this.monsterBullets.callAll('kill')

        this.levelNumber++;
        this.levelText.text = "Level: " + this.levelNumber;

        this.level = [];
        generateMonsters(this.levelNumber, this.channel)
        renderMonsters(this)
    }

    pickUp(player, drop) {
        drop.kill();
        if(drop.key === "lifeUp") {
            var missingLife = this.lives.getFirstDead();
            var nextLife;
            if(missingLife) {
                nextLife = this.lives.getChildAt(missingLife.z);
            }

            if(nextLife && nextLife.alive === false) {
                nextLife.revive();
            }
            else if(missingLife) {
                missingLife.revive();
            }
        }
        else if(drop.key === "powerUp") {
            var rand, tween;

            if(!this.player.powerUps.doubleSpeed && !this.player.powerUps.doubleShot) {
                rand = this.game.rnd.integerInRange(0, 1);
            }
            else if(this.player.powerUps.doubleSpeed) {
                rand = 1;
            }
            else if(this.player.powerUps.doubleShot) {
                rand = 0;
            }

            if(rand === 0 && !this.player.powerUps.doubleSpeed) {
                this.PLAYER_FIRING_RATE = this.PLAYER_FIRING_RATE - (this.PLAYER_FIRING_RATE / 2);
                this.player.powerUps.doubleSpeed = true;
                this.announcementText.text = "Double Speed!";
                this.announcementText.alpha = 1;
                tween = this.game.add.tween(this.announcementText).to( { alpha: 0 }, 2000, "Linear", true);
                tween.start();
            }
            else if(rand === 1 && !this.player.powerUps.doubleShot) {
                this.player.powerUps.doubleShot = true;
                this.announcementText.text = "Double Shot!";
                this.announcementText.alpha = 1;
                tween = this.game.add.tween(this.announcementText).to( { alpha: 0 }, 2000, "Linear", true);
                tween.start();
            }
        }
    }
}
