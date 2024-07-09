import { Message } from "../../Message/Message";

export abstract class Inspection {
    // The output of an Inspection
    // can be a message or in bullet points.
    abstract get message(): Message;
    abstract get bullets(): string;

    // This function calls the test.
    abstract inspect(value: any): Promise<boolean>;
}