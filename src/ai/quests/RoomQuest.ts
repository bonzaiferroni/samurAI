import { Quest } from "./Quest";

export class RoomQuest extends Quest {

    room = Game.rooms[this.roomName];

    constructor(public roomName: string) {
        super();
    }

    get hasVision() {
        return this.room !== undefined;
    }
}
