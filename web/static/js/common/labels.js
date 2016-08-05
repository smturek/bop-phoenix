import {syncPosition} from "./sync"

const DEFAULT_STYLE = {font: "65px Arial", fill: "#ffffff"};

export const createLabel = (state, message, channel, id, style = DEFAULT_STYLE) => {
    const {centerX, centerY} = state.world;
    const label = state.add.text(centerX, centerY, message, style);
    label.anchor.setTo(0.5);
    label.inputEnabled = true;

    label.id = id;

    syncPosition(label, channel, label.events.onDragUpdate);

    return label;
};
