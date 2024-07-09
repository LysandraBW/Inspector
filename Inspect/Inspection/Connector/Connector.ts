import { Inspection } from "../Inspection";
import { Message } from "../../../Message/Message";
import { mergeGroup } from "../../../Message/Merger";
import { bulletPoints } from "../../../Message/Bullet";
import { Conjunction, ConjunctionWord } from "../../../Message/Block/Connector/Conjunction";
import { And as _And, Or as _Or, Xor as _Xor } from "../../../Message/Block/Connector/Conjunction";

export class Connector extends Inspection {
    #test: (values: Array<boolean>) => Promise<boolean>;
    #connector: Conjunction;
    #inspections: Array<Inspection>;
    #failedInspections: Array<Inspection>;
    
    constructor(test: (values: Array<boolean>) => Promise<boolean>, inspections: Array<Inspection>, conjunction: Conjunction) {
        super();
        this.#test = test;
        this.#connector = conjunction;
        this.#inspections = inspections;
        this.#failedInspections = [];
    }

    get message(): Message {
        // Must call this function after
        // calling the test function.
        const message: Message = mergeGroup(
            [...this.#failedInspections.map(e => e.message)], 
            this.#connector
        );
        return message;
    }

    get bullets(): string {
        // Must call this function after
        // calling the test function.
        const bullets: string = bulletPoints(
            [...this.#failedInspections.map(e => e.message.toString())],
            this.#connector
        );
        return bullets;
    }

    async inspect(value: any): Promise<boolean> {
        this.#failedInspections = [];

        // These values are used for the actual test.
        const values: Array<boolean> = [];
        for (const inspector of this.#inspections) {
            values.push(await inspector.inspect(value));
            if (!values[values.length-1]) {
                this.#failedInspections.push(inspector);
            }
        }
        
        // Must specify all inspectors for 
        // "Or" and "Xor" connectors.
        const inspectionGrade = await this.#test(values);
        if (!inspectionGrade && this.#connector.type !== "And") {
            this.#failedInspections = this.#inspections;
        }
        return inspectionGrade;
    }
}

export const And = (inspections: Array<Inspection>, block: ConjunctionWord = "And") => {
    return new Connector(async v => !v.includes(false), inspections, _And(block));
}

export const Or = (inspections: Array<Inspection>, block: ConjunctionWord = "Or", level: number = 1) => {
    return new Connector(async v => v.filter(b => b).length >= level, inspections, _Or(block, level));
}

export const Xor = (inspections: Array<Inspection>, block: ConjunctionWord = "Or", level: number = 1) => {
    return new Connector(async v => v.filter(b => b).length === level, inspections, _Xor(block, level));
}