import { Message } from "./Message";
import { Block } from "./Block/Block";
import { Conjunction, Or, Xor, isConjunction } from "./Block/Connector/Conjunction";
import { Connector, Period } from "./Block/Connector/Connector";
import { toRelativeClause } from "./Grammar";
import { Functional } from "./Block/Non-Connector/Functional";
import { NonConnector } from "./Block/Non-Connector/Non-Connector";

export const mergeGroup = (messages: Array<Message>, conjunction: Conjunction) => {
    if (messages.length === 0) {
        return null;
    }
    for (let i = 1; i < messages.length; i++) {
        merge(messages[0], messages[i], conjunction);
    }
    return messages[0];
}

export const merge = (m1: Message, m2: Message, conjunction: Conjunction): void => {
    if (m1.getStatements().length > 1 || m2.getStatements().length > 1) {
        mergeStatements(m1, m2, conjunction);
    }
    else if (m1.type === m2.type) {
        mergeLikeMessages(m1, m2, conjunction);
    }
    else if (m1.type === "Declarative") {
        mergeUnlikeMessages(m1, m2, conjunction);
    }
    else {
        mergeUnlikeMessages(m2, m1, conjunction);
    }
}

export const mergeStatements = (m1: Message, m2: Message, conjunction: Conjunction): void => {
    const m1Statements: Array<Message> = m1.getStatements();
    const m2Statements: Array<Message> = m2.getStatements();

    for (const m2Statement of m2Statements) {
        // [Index of M1 Statement, Merge Index]
        let partner = [-1, 0];
        for (let i = 0; i < m1Statements.length; i++) {
            const m1Statement = m1Statements[i];
            const index = mergeIndex(m1Statement, m2Statement, conjunction);
            if (index < partner[1] || !partner[1]) {
                partner = [i, index];
            }
        }

        if (!partner[1]) {
            convergeMessages(m1, m2);
        }
        else if (partner[1] >= 0) {
            merge(m1Statements[partner[0]], m2Statement, conjunction);
            m1.start.next[partner[0]] = m1Statements[partner[0]].start;
        }
    }
}

export const mergeLikeMessages = (m1: Message, m2: Message, conjunction: Conjunction): void => {
    const depth = sharedDepth(m1, m2);
    if (depth === 0 || !mergeIndex(m1, m2, conjunction)) {
        // This needs to be worked on.
        if (conjunction.type === "Or") {
            convergeMessages(m1, m2, Or(";"));
        }
        else if (conjunction.type === "Xor") {
            convergeMessages(m1, m2, Xor("Either-Or"));
        }
        else {
            convergeMessages(m1, m2);
        }
    }
    else {
        mergeLevels(m1.levels[depth-1], m2.levels[depth-1], conjunction);
        m1.updateLevels();
    }
}

export const mergeUnlikeMessages = (m1: Message, m2: Message, conjunction: Conjunction): void => {
    if (conjunction.type === "Or" || conjunction.type === "Xor") {
        toRelativeClause(m2);
        m2.insertStart(new NonConnector("Descriptive", "That", "an input"));
        convergeMessages(m1, m2, conjunction);
        m1.updateLevels();
        return;
    }

    const thatInstances = m1.locateBlocks(b => b.type === "That");
    if (!thatInstances.length) {
        toRelativeClause(m2);
        convergeLevel(m1, m1.levels.length - 1, m2.start);
        m1.updateLevels();
    }
    else if (thatInstances.length === 1) {
        toRelativeClause(m2);
        mergeBlocks(thatInstances[0], m2.locateBlocks(b => b.type === "That")[0], conjunction);
        m1.updateLevels();
    }
    else if (thatInstances.length > 1) {
        convergeMessages(m1, m2);
        m1.updateLevels();
    }
}

export const mergeLevels = (l1: Array<Block>, l2: Array<Block>, conjunction: Conjunction): void => {
    l1.sort((a, b) => a.block.localeCompare(b.block));
    l2.sort((a, b) => a.block.localeCompare(b.block));
    for (let i = 0; i < l1.length; i++) {
        mergeBlocks(l1[i], l2[i], conjunction);
    }
}

export const mergeConnectors = (b1: Block, b2: Block, conjunction: Conjunction): void => {
    if (isConjunction(b1) && isConjunction(b2)) {
        mergeNextBlocks(b1, b2, conjunction);
    }
    else if (isConjunction(b1)) {
        // We're checking if b2 must be merged into b1.next
        // or if it can be simply added.
        const overlap = b1.next.find(b => b.block === b2.block);
        if (overlap) {
            mergeBlocks(overlap, b2, conjunction);
        }
        else {
            b1.addNext(b2);
        }
    }
    else {
        // Because b2 is a conjunction, we insert a conjunction
        // before b1. Now, there are two conjunctions wherein
        // we can merge the next blocks.
        const connector = conjunction.copy();
        b1.insertNext(connector);
        mergeNextBlocks(connector, b2, conjunction);
    }
}

export const mergeNextBlocks = (b1: Block, b2: Block, conjunction: Conjunction): void => {
    for (const n2 of b2.next) {
        // We look for matching pairs of blocks 
        // between b1.next and b2.next
        const n1 = b1.next.find(b => b.block === n2.block);
        if (n1) {
            mergeBlocks(n1, n2, conjunction);
        }
    }
}

export const mergeBlocks = (b1: Block, b2: Block, conjunction: Conjunction): void => {
    if (isConjunction(b1) && isConjunction(b2)) {
        mergeNextBlocks(b1, b2, conjunction);
        return;
    }

    // If it's not a conjunction, it must be a non-connector.
    // So, we know that b1 and b2 can only point to one object.
    const n1 = b1.next[0];
    const n2 = b2.next[0];

    // Nothing to merge.
    if ((n1 && !n2) || (!n1 && !n2)) {
        return;
    }

    if (!n1 && n2) {
        b1.addNext(n2);
    }
    else if (n1.block === n2.block) {
        mergeBlocks(n1, n2, conjunction);
    }
    // If n1 and n2 are non-connectors, we can insert a
    // connector and have it point to n1 and n2.
    else if (!isConjunction(n1) && !isConjunction(n2)) {
        const connector = conjunction.copy();
        b1.insertNext(connector);
        connector.addNext(n2);
    }
    else {
        mergeConnectors(n1, n2, conjunction);
    }
}

export const convergeLevel = (m: Message, l: number, b: Block): void => {
    const blocks = m.levels[l];
    for (const block of blocks) {
        block.addNext(b);
    }
    m.updateLevels();
}

export const convergeMessages = (m1: Message, m2: Message, connector: Connector = Period()): void => {
    // Checks if the connector already exists.
    if (m1.start.constructor.name === connector.constructor.name) {
        m1.start.addNext(m2.start);
    }
    else {
        connector.addNext(m1.start);
        connector.addNext(m2.start);
        m1.start = connector;
    }
    m1.updateLevels();
}

export const mergeIndex = (m1: Message, m2: Message, conjunction: Conjunction): number => {
    const thatInstances1 = m1.numberInstances(b => b.type === "That");
    const thatInstances2 = m2.numberInstances(b => b.type === "That");
    if (thatInstances1 > 1 || thatInstances2 > 1) {
        return 0;
    }

    const conflictingConjunction1 = m1.locateBlocks(b => isConjunction(b) && b.type !== conjunction.type)[0];
    const conflictingConjunction2 = m2.locateBlocks(b => isConjunction(b) && b.type !== conjunction.type)[0];
    if (conflictingConjunction1 || conflictingConjunction2) {
        return 0;
    }    

    return m1.getLength() + m2.getLength(sharedDepth(m1, m2));
}

export const sharedDepth = (m1: Message, m2: Message): number => {
    const maxDepth = Math.min(m1.levels.length, m2.levels.length);
    let depth = 0;
    for (let i = 0; i < maxDepth; i++) {
        if (!compareLevels(m1.levels[i], m2.levels[i]))
            break;
        depth++;
    }
    return depth;
}

export const compareLevels = (l1: Array<Block>, l2: Array<Block>): boolean => {
    if (l1.length !== l2.length) {
        return false;
    }
    const b1 = l1.map(b => b.block).sort();
    const b2 = l2.map(b => b.block).sort();
    for (let i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[i]) {
            return false;
        }
    }
    return true;
}