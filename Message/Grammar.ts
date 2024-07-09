import { Message } from "./Message";
import { Connector } from "./Block/Connector/Connector";
import { That, Does } from "./Block/Non-Connector/Functional";

export const toRelativeClause = (m: Message): void => {
    const action = m.locateBlocks(b => b.type === "Action")[0];
    const negation = m.locateBlocks(b => b.type === "Negation")[0];

    if (negation) {
        const that = That();
        const does = Does();
        that.addNext(does);
        does.addNext(negation);
        m.start = that;
    }
    else if (action) {
        const that = That();
        that.addNext(action);
        const actions = action.block.split(" ");
        actions[0] = thirdPersonSingularVerb(actions[0]);
        action.block = actions.join(" ");
        m.start = that;
    }

    m.updateLevels();
}

export const thirdPersonSingularVerb = (v: string): string => {
    if (Object.keys(irregularVerbs()).includes(v)) {
        return irregularVerbs()[v];
    }
    else if (endsIn(v, ["s", "ch", "sh", "ss", "x", "z"])) {
        return v + "es";
    }
    else if (endsIn(v, ["y"])) {
        return v.slice(0, -1) + "ies";
    }
    else {
        return v + "s";
    }
}

export const endsIn = (str: string, ends: Array<string>): boolean => {
    for (const end of ends) {
        const wordEnd = str.slice(-end.length);
        if (wordEnd === end) {
            return true;
        }
    }
    return false;
}

export const connectClauses = (clauses: Array<string>, connector: Connector): string => {
    const single = singleConnector();
    const double = doubleConnector();

    if (connector.block[0] === ";") {
        return connect(format(clauses), single[connector.block]);
    }
    else if (single[connector.block]) {
        return connect(clauses, single[connector.block]);
    } 
    else if (double[connector.block]) {
        let m = connector.level > 1 ?  `${connector.level} of the following: ` : "";
        return `${double[connector.block]} ${m}${connect(clauses, "or")}`;
    }
    else if (connector.type === "Period") {
        return `${clauses.join(`${connector.block} `)}`;
    }
    else {
        return "";
    }
}

const connect = (clauses: Array<string>, connector: string): string => {
    if (connector[0] === ";") {
        return `${clauses.slice(0, clauses.length).join(`${connector} `)}`;
    }
    else if (clauses.length === 0) {
        return "";
    }
    else if (clauses.length === 1) {
        return clauses[0];
    }
    else if (clauses.length === 2) {
        return `${clauses[0]} ${connector} ${clauses[1]}`;
    }
    else {
        return `${clauses.slice(0, clauses.length - 1).join(`, `)}, ${connector} ${clauses[clauses.length - 1]}`;
    }
}

const format = (clauses: Array<string>): Array<string> => {
    return clauses.map((clause, index) => {
        if (index === 0) {
            return clause;
        }
        else {
            return clause.charAt(0).toLowerCase() + clause.slice(1);
        }
    })
}

const doubleConnector = (): {[k: string]: string} => {
    return {
        "Only": "only",
        "Either-Or": "either",
        "At-Least": "at least"
    }
}

const singleConnector = (): {[k: string]: string} => {
    return {
        "Or": "or",
        ";": "; or",
        "And": "and",
        "Period": ".",
        "And-Or": "and/or",   
    }
}

const irregularVerbs = (): {[k: string]: string} => {
    return {
        "be": "is",
        "have": "has",
    };
}