import { MessageType } from "../../Message";
import { NonConnector } from "./Non-Connector";

export type ContentType = "Command" | "Negation" | "Action" | "Condition";

export class Content extends NonConnector {
    #type: ContentType;

    constructor(messageType: MessageType, type: ContentType, block: string) {
        super(messageType, type, block);
        this.#type = type;
    }

    get type(): ContentType {
        return this.#type;
    }

    set type(type: ContentType) {
        this.#type = type;
    }

    copy(): Content {
        const block = new Content(this.messageType, this.type, this.block);
        block.next = this.next;
        return block;
    }
}