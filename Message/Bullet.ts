import { Conjunction, ConjunctionWord } from "./Block/Connector/Conjunction";

type BulletPoints = {[k: string]: Array<BulletPoints|string>}

export const bulletize = (bP: string, nL = 0): Array<[number, string]> => {
    const bullets: Array<[number, string]> = [];
    const bulletPoints: BulletPoints = JSON.parse(bP);

    let nestedLevel = nL;
    for (const [conjunction, messages] of Object.entries(bulletPoints)) {
        bullets.push([nestedLevel, getHeader(JSON.parse(conjunction))]);
        for (const message of messages) {
            // String
            if (typeof message === "string") {
                bullets.push([nestedLevel + 1, message]);
            }
            // Bullet Points
            else {
                for (const [l, m] of bulletize(JSON.stringify(message), nestedLevel+1)) {
                    bullets.push([l, m]);
                }
            }
        }
    }

    return bullets;
}

export const bulletPoints = (messages: Array<string>, conjunction: Conjunction): string => {
    const bulletBox: BulletPoints = {};
    bulletBox[JSON.stringify([conjunction.type, conjunction.level])] = [...messages.map(message => {
        try {
            // If the parsing doesn't throw an error
            // we have an object (BulletPoints)
            const object = JSON.parse(message);
            return object;
        }
        catch (e) {
            // We have a literal string
            return message;
        }
    })];
    return JSON.stringify(bulletBox);
}

export const getHeader = (conjunction: [string, number]): string => {
    switch (conjunction[0]) {
        case "And":
            return "Must have the following:";
        case "Or":
            return `Must have at least ${conjunction[1]} of the following:`;
        case "Xor":
            return `Must have only ${conjunction[1]} of the following:`;
        default:
            return "";
    }
}