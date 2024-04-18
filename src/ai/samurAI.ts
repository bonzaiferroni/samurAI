import { Forage } from "./quests/Forage";

export class samurAI{

    private memory = Memory.ai;
    private energyQuests = _.sortBy(this.memory.quests.forage, x => x.sourceId)
        .map((x, i) => {
            var source = Game.getObjectById(x.sourceId);
            new Forage(source, i, x)
        });

    advance() {
        for(const id in Game.spawns) {
            const spawn = Game.spawns[id]
            spawn.room.visual.circle(spawn.pos, {radius: 1, stroke: "pink"});

            if (!_.any(this.energyQuests, x => x.memory.spawnId == id)) {
                const sources = spawn.room.find(FIND_SOURCES);
                for (let i = 0; i < sources.length; i++) {
                    const source = sources[i];
                    const questMemory = {spawnId: spawn.id, sourceId: source.id};
                    this.memory.quests.forage.push(questMemory);
                    this.energyQuests.push(new Forage(i, questMemory));
                }
            }
        }

        for (const quest of this.energyQuests) {
            quest.advance();
        }
    }
}
