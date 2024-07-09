import { Block } from "../Block";
import { MessageType } from "../../Message";
import { ConjunctionType } from "./Conjunction";
import { ConjunctionWord } from "./Conjunction";

export type ConnectorType = ConjunctionType | "Period";
export type ConnectorWord = ConjunctionWord | ".";

export class Connector extends Block {
    #type: ConnectorType;
    #next: Array<Block>;

    constructor(messageType: MessageType, type: ConnectorType, block: string) {
        super(messageType, block);
        this.#type = type;
        this.#next = [];
    }

    get level(): number {
        return 1;
    }

    get next(): Array<Block> {
        return this.#next;
    }

    set next(blocks: Array<Block>) {
        this.#next = blocks;
    }
    
    get type(): ConnectorType {
        return this.#type;
    }

    set type(type: ConnectorType) {
        this.#type = type;
    }

    copy(): Connector {
        const connector = new Connector(this.messageType, this.type, this.block);
        const nextBlock = [];
        for (const next of this.next) {
            nextBlock.push(next.copy());
        }
        connector.next = nextBlock;
        return connector;
    }

    addNext(block: Block): void {
        this.#next.push(block);
    }

    insertNext(block: Block): void {
        for (const next of this.#next) {
            block.addNext(next);
        }
        this.#next = [block];
    }
}

export const Period = (): Connector => {
    return new Connector("", "Period", ".");
}

export const isPeriod = (block: Block): boolean => {
    return block.type === "Period";
}