import { ForageMemory } from "./quests/Forage";

export interface AiMemory {
    quests: {
        forage: ForageMemory[];
    }
}
