import { bulletize } from "../Message/Bullet";
import { Inspection } from "./Inspection/Inspection";

type OutputType = "Message" | "Bullet";

export default class Inspector {
    inspection: Inspection;
    outputType: OutputType;
    optional: boolean;

    constructor(inspection: Inspection, outputType: OutputType = "Message", optional: boolean = false) {
        this.inspection = inspection;
        this.outputType = outputType;
        this.optional = optional;
    }

    async inspect(value: any): Promise<[boolean, any?]> {
        if (this.optional && !value) {
            return [true];
        }
        
        // Passed Inspection
        if (await this.inspection.inspect(value)) {
            return [true];
        }
        // Failed Inspection
        else {
            let output = (): any => {
                if (this.outputType === "Message")
                    return this.inspection.message.toString();
                return bulletize(this.inspection.bullets);
            };
            return [false, output()];
        }
    }
}
