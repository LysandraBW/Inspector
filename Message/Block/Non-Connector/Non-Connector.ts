import { MessageType } from "../../Message";
import { Block } from "../Block";
import { ContentType } from "./Content";
import { FunctionalType } from "./Functional";

export type NonConnectorType = ContentType | FunctionalType | "";

export class NonConnector extends Block {
    #type: NonConnectorType;
    #next!: Block;

    constructor(messageType: MessageType, type: NonConnectorType, block: string) {
        super(messageType, block);
        this.#type = type;
    }

    get next(): Array<Block> {
        if (!this.#next) {
            return [];
        }
        return [this.#next];
    }

    set next(blocks: Array<Block>) {
        if (blocks[0]) {
            this.#next = blocks[0];
        }
    }
    
    get type(): NonConnectorType {
        return this.#type;
    }

    set type(type: NonConnectorType) {
        this.#type = type;
    }

    copy(): NonConnector {
        const block = new NonConnector(this.messageType, this.type, this.block);
        block.next = [this.#next];
        return block;
    }

    addNext(block: Block): void {
        this.#next = block;
    }

    insertNext(block: Block): void {
        if (this.#next) {
            block.addNext(this.#next);
        }
        this.#next = block;
    }
}