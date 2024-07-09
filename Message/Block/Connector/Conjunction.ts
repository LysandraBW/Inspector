import { MessageType } from "../../Message";
import { Block } from "../Block";
import { Connector } from "./Connector";

export type ConjunctionType = "And" | "Or" | "Xor";
export type ConjunctionWord = "And" | "Or" | "And-Or" | "Either-Or" | "Only" | "At-Least" | ";";

export class Conjunction extends Connector {
    #type: ConjunctionType;
    #level: number;

    constructor(messageType: MessageType, type: ConjunctionType, block: string, level: number = 1) {
        super(messageType, type, block);
        this.#level = level;
        this.#type = type;
    }

    get level(): number {
        return this.#level;
    }

    set level(level: number) {
        this.#level = Math.max(0, level);
    }

    get type(): ConjunctionType {
        return this.#type;
    }

    set type(type: ConjunctionType) {
        this.#type = type;
    }

    copy(): Conjunction {
        const connector = new Conjunction(this.messageType, this.type, this.block, this.#level);
        const nextBlock = [];
        for (const next of this.next) {
            nextBlock.push(next.copy());
        }
        connector.next = nextBlock;
        return connector;
    }
}

export const And = (word: ConjunctionWord = "And"): Conjunction => {
    return new Conjunction("", "And", word);
}

export const Or = (word: ConjunctionWord = "Or", level: number = 1): Conjunction => {
    return new Conjunction("", "Or", word, level);
}

export const Xor = (word: ConjunctionWord = "Or", level: number = 1): Conjunction => {
    return new Conjunction("", "Xor", word, level);
}

export const isConjunction = (block: Block): boolean => {
    return block.constructor.name === "Conjunction";
}