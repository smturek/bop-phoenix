import {sharePosition, receivePosition} from "../common/sync"
import {createSprite} from "../common/sprites"
import {Monsters} from "./Monsters"

export const renderPlayers = (state) => {
    state.players.map((player) => {
        if (player.id === state.id) {
            state.game.physics.arcade.enable(state.player)
            state.player.anchor.setTo(0.5)
            state.player.kills = 0
            state.player.powerUps = {}
            state.player.id = state.id
            sharePosition(state.player, state.channel)
        }
        else {
            const sprite = createSprite(state.game, player)
            receivePosition(sprite, state.channel)
            state.otherPlayers.add(sprite)
        }
    })
}

export const renderUI = (state) => {
    var life

    for(var i = 0; i < state.PLAYER_MAX_LIFE; i++) {
        life = state.lives.create(846 + 25 * i, 0, 'life', 0)
    }

    state.levelText = state.add.text(16, 0, 'Level: ' + state.levelNumber, { font: '16px arial', fill: '#fff' })
}

export const renderWalls = (state) => {
    var i

    const placeWall = (x, y) => {
        let wall = state.walls.getFirstExists(false)
        if (!wall) {
            wall = state.add.sprite(x, y, 'wall')
            state.game.physics.arcade.enable(wall)
            wall.body.immovable = true
            state.walls.add(wall)
        }
        else {
            wall.reset(x, y)
        }
    }

    for (i = 0; i <= 916; i += 16) {
        if (i <= 532) {
            placeWall(0, i)
            placeWall(916, i)
        }

        placeWall(i, 0)
        placeWall(i, 532)
    }

    //to fix mystery 4x4 square at bottom right edge
    placeWall(916, 532)
}

export const renderMonsters = (state) => {
    const placeMonster = (x, y, id) => {
        var monster = state.monsters.getFirstExists(false);

        if (!monster) {
            monster = new Monsters(state, x, y, 'monster')
            state.game.physics.arcade.enable(monster)
            monster.id = id
            state.monsters.add(monster)
        }
        else {
            monster.reset(x, y)
        }
    }

    state.serverMonsters.map((monster) => {
        placeMonster(monster.position.x, monster.position.y, monster.id)
    })
}
