const BROADCAST_FREQUENCY = 16;

export const syncPosition = (sprite, channel, event) => {
    event.add(sprite => sendPosition(sprite, channel));
    receivePosition(sprite, channel);
}

export const receivePosition = (sprite, channel) => {
    const callback = ({id, x, y}) => {
        if (id === sprite.id) {
            // console.log(sprite.x, sprite.y);
            sprite.position.setTo(x, y)
        }
    }
    channel.on("position", callback);
    removeCallbackOnDestroy(sprite, channel, callback);
}

export const sendPosition = (sprite, channel) => {
    channel.push("position", serializePosition(sprite));
}

export const generateMonsters = (level, channel) => {
    channel.push("generateMonsters", level)
}

export const killMonster = (id, channel) => {
    channel.push('killMonster', id)
}

export const serializePosition = ({id, x, y}) => Object.assign({id, x , y});

const removeCallbackOnDestroy = (sprite, channel, callback) => {
    sprite.events.onDestroy.add(() => {
        channel.bindings = channel.bindings.filter(b => {
            return b.callback !== callback
        })
    })
}

export const sharePosition = (sprite, channel, framerate = BROADCAST_FREQUENCY) => {
    const timer = sprite.game.time.events
    timer.loop(framerate, () => {sendPosition(sprite, channel)})
}
