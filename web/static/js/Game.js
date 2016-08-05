import {Boot} from "./states/Boot"
import {Preload} from "./states/Preload"
import {Menu} from "./states/Menu"
import {Pryssac} from "./states/Pryssac"
import {joinChannel} from "./common/channels"

export class Game extends Phaser.Game {
    constructor(width, height, container) {
        super(width, height, Phaser.AUTO, container, null)

        this.state.add("boot", Boot, false)
        this.state.add("preload", Preload, false)
        this.state.add("menu", Menu, false)
        this.state.add("pryssac", Pryssac, false)
    }

    start(socket) {
        socket.connect()

        this.gotoPryssac = () => {
            const channel = socket.channel("games:pryssac", {})

            joinChannel(channel, (...options) => {
                this.state.start("pryssac", true, false, channel, ...options)
            })
        }

        this.state.start("boot", true, false)
    }
}
