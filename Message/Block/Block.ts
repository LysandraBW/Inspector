import { MessageType } from "../Message";
import { ConnectorType } from "./Connector/Connector";
import { NonConnectorType } from "./Non-Connector/Non-Connector";

type BlockType = ConnectorType | NonConnectorType;

export abstract class Block {
    block: string;
    readonly messageType: MessageType;

    constructor(messageType: MessageType, block: string) {
        this.messageType = messageType;
        this.block = block;
    }

    abstract copy(): Block;
    abstract get type(): BlockType;
    abstract set type(type: BlockType);
    abstract get next(): Array<Block>;
    abstract set next(blocks: Array<Block>);
    abstract addNext(block: Block): void;
    abstract insertNext(block: Block): void;    
}