import { Inspection } from "../Inspection";
import { Message } from "../../../Message/Message";

export class Condition extends Inspection {
    #message: Message;
    #test: (value: string) => Promise<boolean>;

    constructor(test: (value: any) => Promise<boolean>, message: Message) {
        super();
        this.#test = test;
        this.#message = message;
    }

    get message(): Message {
        return this.#message;
    }   

    get bullets(): string {
        return this.#message.toString();
    }

    async inspect(value: any): Promise<boolean> {
        return this.#test(value);
    }
}