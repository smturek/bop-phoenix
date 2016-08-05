export const createSprite = (game, {id, position}) => {
    const sprite = game.add.sprite(position.x, position.y, 'player')
    sprite.id = id
    sprite.anchor.setTo(0.5)
    return sprite
}
