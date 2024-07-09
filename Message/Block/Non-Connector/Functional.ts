import { MessageType } from "../../Message";
import { NonConnector } from "./Non-Connector";

export type FunctionalType = "That" | "Does";

export class Functional extends NonConnector {
    #type: FunctionalType;

    constructor(messageType: MessageType, type: FunctionalType, block: string) {
        super(messageType, type, block);
        this.#type = type;
    }

    get type(): FunctionalType {
        return this.#type;
    }

    set type(type: FunctionalType) {
        this.#type = type;
    }

    copy(): Functional {
        const block = new Functional(this.messageType, this.type, this.block);
        block.next = this.next;
        return block;
    }
}

export const That = () => {
    return new Functional("Descriptive", "That", "that");
}

export const Does = () => {
    return new Functional("Descriptive", "Does", "does");
}