import {Game} from "./Game"
import {Socket} from "phoenix"

const token = document.head.querySelector("[name=token]").content
const socket = new Socket("/socket", {params: {token: token}});

const game = new Game(932, 548, "phaser");

game.start(socket);
