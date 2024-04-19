import { bodyBuild } from "../../utils/BodyBuilder";
import { RoomQuest } from "./abstract/RoomQuest";

export interface ForageMemory {
    sourceId: Id<Source>;
    spawnId: Id<StructureSpawn>;
    extensionIds: Id<StructureExtension>[] | null;
}

export class Forage extends RoomQuest {

    protected constructor(
        roomName: string,
        source: Source | null,
        public index: number,
        public memory: ForageMemory
    ) {
        super(roomName);

        if (source) {
            if (!this.memory.extensionIds) {
                this.memory.extensionIds = source.room.find(FIND_MY_STRUCTURES)
                    .filter(x => x.structureType === STRUCTURE_EXTENSION)
                    .map(x => x.id as Id<StructureExtension>);
            }
        }
    }

    protected advance(): void {
        const foragerName = `forager-${this.index}`;
        const pollinatorName = `pollinator-${this.index}`;
        const forager = Game.creeps[foragerName];
        const pollinator = Game.creeps[pollinatorName];
        const spawn = Game.getObjectById(this.memory.spawnId);
        const source = Game.getObjectById(this.memory.sourceId);
        const extensions = this.memory.extensionIds?.map(x => Game.getObjectById(x));

        if (source) {
            this.advanceFlowers();
            if (spawn) {
                if (forager) {
                    this.advanceForager(forager, source);
                    if (pollinator) {
                        spawn.spawnCreep(bodyBuild(0, 3, 3), pollinatorName);
                    }
                } else {
                    spawn.spawnCreep(bodyBuild(2, 1, 1), foragerName);
                }
            }

            if (extensions) {
                // this.advancePollinator();
            }
        }
    }

    protected advanceFlowers(): void {
        // TODO: this
    }

    protected advanceForager(forager: Creep, source: Source): void {
        if (forager.pos.isNearTo(source)) {
            if (forager.store.energy < forager.store.getCapacity()) {
                const droppedEnergy = forager.pos.lookFor(LOOK_ENERGY)[0];
                if (droppedEnergy) {
                    forager.pickup(droppedEnergy);
                } else {
                    forager.harvest(source);
                }
            } else {
                forager.say("😴");
            }
        } else {
            forager.moveTo(source);
        }
    }

    private advancePollinator(
        pollinator: Creep & { memory: { hasPollen: boolean, targetId: Id<Flower> | null } },
        forager: Creep,
        flowers: Flower[]
    ): void {
        if (pollinator.memory.hasPollen) {
            if (pollinator.store.energy > 0) {
                if (pollinator.memory.targetId) {
                    let target: Flower | null = Game.getObjectById(pollinator.memory.targetId);
                    while (target) {
                        if (target.store.energy === target.store.getCapacity(RESOURCE_ENERGY)) {
                            const emptyFlowers = flowers
                                .filter(x => x.store.energy < x.store.getCapacity(RESOURCE_ENERGY));
                            target = pollinator.pos.findClosestByRange(emptyFlowers);
                            continue;
                        }

                        const result = pollinator.transfer(target, RESOURCE_ENERGY);
                        switch (result) {
                        case OK:
                            break;
                        case ERR_NOT_IN_RANGE:
                            pollinator.moveTo(target);
                            break;
                        }
                    }
                }
            } else {
                pollinator.memory.hasPollen = false;
            }
        }
    }

    /* TODO: Implement this
        if (this.remoteSpawning) { return this.workerBody(6, 1, 6); }
        let minersSupported = this.minersSupported();
        if (minersSupported === 1) {
            let work = Math.ceil((Math.max(this.source.energyCapacity,
                        SOURCE_ENERGY_CAPACITY) / ENERGY_REGEN_TIME) / HARVEST_POWER) + 1;
            return this.workerBody(work, 1, Math.ceil(work / 2));
        } else if (minersSupported === 2) {
            return this.workerBody(3, 1, 2);
        } else { return this.workerBody(2, 1, 1); }
     */

}
