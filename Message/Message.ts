import { Block } from "./Block/Block";
import { Content } from "./Block/Non-Connector/Content";
import { Connector } from "./Block/Connector/Connector";
import { isPeriod } from "./Block/Connector/Connector";
import { Conjunction, isConjunction } from "./Block/Connector/Conjunction";
import { connectClauses } from "./Grammar";
import { ContentType } from "./Block/Non-Connector/Content";

export type MessageType = "Informative" | "Declarative" | "Descriptive" | "";

export class Message {
    type: MessageType;
    start: Block;
    levels: Array<Array<Block>>;

    constructor(type: MessageType, block: Block) {
        this.type = type;
        this.start = block;
        this.updateLevels();
    }

    toString(start = this.start): string {
        if (isConjunction(start) || isPeriod(start)) {
            const blocks: Array<string> = [];
            for (const b of start.next) {
                blocks.push(this.toString(b));
            }
            if (isConjunction(start))
                return connectClauses(blocks, start as Conjunction);
            else
                return connectClauses(blocks, start as Connector);
        }
        else if (!start.next.length) {
            return start.block;
        }
        else if (start.next[0].type === "Negation" && start.next[0].block[0] === "-") {
            return `${start.block}${this.toString(start.next[0]).slice(1)}`;
        }
        else {
            return `${start.block} ${this.toString(start.next[0])}`;
        }
    }
    
    getLength(level: number = 0): number {
        let length = 0;
        for (let i = level; i < this.levels.length; i++) {
            length += this.levels[i].length;
        }
        return length;
    }

    getStatements(): Array<Message> {
        if (!isPeriod(this.start)) {
            return [this];
        }
        const statements: Array<Message> = [];
        for (const next of this.start.next) {
            const statement = new Message(next.messageType, next); 
            statements.push(statement);
        }
        return statements;
    }

    updateLevels(): void {
        this.levels = [];
        this.updateBlockLevel(this.start);
    }

    updateBlockLevel(block: Block, level: number = 0): void {
        if (this.levels.length <= level) {
            this.levels.push([]);
        }

        this.levels[level].push(block);
        for (const next of block.next) {
            this.updateBlockLevel(next, level + 1);
        }
    }

    locateBlockLevels(callback: (b: Block) => boolean): Array<number> {
        let blockLevels: Array<number> = [];
        for (let i = 0; i < this.levels.length; i++) {
            for (const block of this.levels[i]) {
                if (callback(block)) {
                    blockLevels.push(i);
                }
            }
        }
        return blockLevels;
    }

    locateBlocks(callback: (b: Block) => boolean): Array<Block> {
        let blocks: Array<Block> = [];
        for (const level of this.levels) {
            for (const block of level) {
                if (callback(block)) {
                    blocks.push(block);
                }
            }
        }
        return blocks;
    }

    numberInstances(callback: (b: Block) => boolean): number {
        let instances = 0;
        for (const level of this.levels) {
            for (const block of level) {
                if (callback(block)) {
                    instances++;
                }
            }
        }
        return instances;
    }

    insertStart(block: Block) {
        block.next = [this.start];
        this.start = block;
        this.updateLevels();
    }
}

export const setMessage = (messageType: MessageType, message: [string, string, string, string]): Message => {
    const contentLayout: Array<ContentType> = ["Command", "Negation", "Action", "Condition"];
    const blocks: Array<Block> = [];
    for (let i = 0; i < 4; i++) {
        if (!message[i]) {
            continue;
        }
        blocks.push(new Content(messageType, contentLayout[i], message[i]));
    }
    for (let i = 0; i < blocks.length - 1; i++) {
        blocks[i].addNext(blocks[i+1]);
    }
    return new Message(messageType, blocks[0]);
}