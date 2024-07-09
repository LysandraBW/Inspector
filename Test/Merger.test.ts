import { test, expect } from "vitest";
import { setMessage } from "../Message/Message";
import { And, Or } from "../Message/Block/Connector/Conjunction";
import { sharedDepth, merge, mergeLikeMessages, mergeUnlikeMessages, mergeIndex, mergeGroup } from "../Message/Merger";

test("Shared Upper Depth", () => {
    const m1 = setMessage("Descriptive", ["Must", "", "have", "A"]);
    const m2 = setMessage("Descriptive", ["Must", "", "have", "B"]);
    expect(sharedDepth(m1, m2)).toBe(2);
});

test("Merge Like Messages", () => {
    const m1 = setMessage("Descriptive", ["Must", "", "have", "A"]);
    const m2 = setMessage("Descriptive", ["Must", "", "have", "B"]);
    mergeLikeMessages(m1, m2, And());
    expect(m1.toString()).toBe("Must have A and B");
})

test("Merge Like Messages", () => {
    const m1 = setMessage("Informative", ["", "", "is", "A"]);
    const m2 = setMessage("Informative", ["", "", "is", "B"]);
    mergeLikeMessages(m1, m2, And());
    expect(m1.toString()).toBe("is A and B");
})

test("Merge Unlike Messages", () => {
    const m1 = setMessage("Declarative", ["Please", "", "enter", "an input"]);
    const m2 = setMessage("Descriptive", ["Must", "not", "have", "numbers"]);
    mergeUnlikeMessages(m1, m2, And());
    expect(m1.toString()).toBe("Please enter an input that does not have numbers");
})

test("'Must have letters'", () => {
    const message = setMessage("Descriptive", ["Must", "", "have", "letters"]);
    expect(message.toString()).toBe("Must have letters");
})

test("'Must not have letters'", () => {
    const message = setMessage("Descriptive", ["Must", "not", "have", "letters"]);
    expect(message.toString()).toBe("Must not have letters");
})

test("'Please enter an input'", () => {
    const message = setMessage("Descriptive", ["Please", "", "enter", "an input"]);
    expect(message.toString()).toBe("Please enter an input");
})

test("'Please enter an input that has letters'", () => {
    const declarative = setMessage("Declarative", ["Please", "", "enter", "an input"]);
    const descriptive = setMessage("Descriptive", ["Must", "", "have", "letters"]);
    merge(declarative, descriptive, And());
    expect(declarative.toString()).toBe("Please enter an input that has letters");
})

test("'Please enter an input that has letters and numbers'", () => {
    const declarative = setMessage("Declarative", ["Please", "", "enter", "an input"]);
    const descriptive1 = setMessage("Descriptive", ["Must", "", "have", "letters"]);
    const descriptive2 = setMessage("Descriptive", ["Must", "", "have", "numbers"]);
    merge(declarative, descriptive1, And());
    merge(declarative, descriptive2, And());
    expect(declarative.toString()).toBe("Please enter an input that has letters and numbers");
})

test("'Please enter an input that has letters and numbers'", () => {
    const declarative = setMessage("Declarative", ["Please", "", "enter", "an input"]);
    const descriptive1 = setMessage("Descriptive", ["Must", "", "have", "letters"]);
    const descriptive2 = setMessage("Descriptive", ["Must", "", "have", "numbers"]);
    merge(descriptive1, descriptive2, And());
    merge(declarative, descriptive1, And());
    expect(declarative.toString()).toBe("Please enter an input that has letters and numbers"); 
})

test("'Must have A, B, or C'", () => {
    const desc1 = setMessage("Descriptive", ["Must", "", "have", "A"]);
    const desc2 = setMessage("Descriptive", ["Must", "", "have", "B"]);
    const desc3 = setMessage("Descriptive", ["Must", "", "have", "C"]);
    merge(desc1, desc2, Or("Or"));
    merge(desc1, desc3, Or("Or"));
    expect(desc1.toString()).toBe("Must have A, B, or C");
})

test("'Please enter a phone number that has A or B'", () => {
    const declarative = setMessage("Declarative", ["Please", "", "enter", "a phone number"]);
    const descriptive1 = setMessage("Descriptive", ["Must", "", "have", "A"]);
    const descriptive2 = setMessage("Descriptive", ["Must", "", "have", "B"]);
    merge(descriptive1, descriptive2, Or("Or"));
    merge(declarative, descriptive1, And());
    expect(declarative.toString()).toBe("Please enter a phone number that has A or B");
})

test("'Must not have symbols. Should have letters'", () => {
    const m1 = setMessage("Descriptive", ["Must", "not", "have", "symbols"]);
    const m2 = setMessage("Descriptive", ["Should", "", "have", "letters"]);
    merge(m1, m2, And());
    expect(m1.toString()).toBe("Must not have symbols. Should have letters");
})

test("'Must not have A and B; or must have C'", () => {
    const m1 = setMessage("Descriptive", ["Must", "not", "have", "A"]);
    const m2 = setMessage("Descriptive", ["Must", "not", "have", "B"]);
    const m3 = setMessage("Descriptive", ["Must", "", "have", "C"]);
    merge(m1, m2, And());
    merge(m1, m3, Or(";"));
    expect(m1.toString()).toBe("Must not have A and B; or must have C");
})

test("'Must not have A or B. Must have C'", () => {
    const m1 = setMessage("Descriptive", ["Must", "not", "have", "A"]);
    const m2 = setMessage("Descriptive", ["Must", "not", "have", "B"]);
    const m3 = setMessage("Descriptive", ["Must", "", "have", "C"]);
    merge(m1, m2, Or("Or"));
    merge(m1, m3, And());
    expect(m1.toString()).toBe("Must not have A or B. Must have C"); 
})

test("Mergeable Level of -1 (Conflicting Conjunctions)", () => {
    const m1 = setMessage("Descriptive", ["Must", "not", "have", "A"]);
    const m2 = setMessage("Descriptive", ["Must", "not", "have", "B"]);
    const m3 = setMessage("Descriptive", ["Must", "", "have", "C"]);
    merge(m1, m2, Or("Or"));
    merge(m1, m3, And());
    expect(mergeIndex(m1, m3, And())).toBe(0); 
})

test("Mergeable Level of -1 (Multiple That)", () => {
    const m1 = setMessage("Declarative", ["Please", "", "enter", "an A"]);
    const m2 = setMessage("Descriptive", ["Must", "not", "have", "B"]);
    merge(m1, m2, And());
    expect(m1.toString()).toBe("Please enter an A that does not have B");

    const m3 = setMessage("Declarative", ["Must", "", "select", "a C"]);
    const m4 = setMessage("Descriptive", ["Must", "", "include", "D" ]);
    merge(m3, m4, And());
    expect(m3.toString()).toBe("Must select a C that includes D");

    merge(m1, m3, Or("Or"));
    expect(m1.toString()).toBe("Please enter an A that does not have B; or must select a C that includes D");

    const m5 = setMessage("Declarative", ["Please", "", "enter", "a B"]);
    expect(mergeIndex(m1, m5, And())).toBe(0);
    expect(mergeIndex(m1, m5, Or("Or"))).toBe(0);

    merge(m1, m5, And());
    expect(m1.toString()).toBe("Please enter an A that does not have B; or must select a C that includes D. Please enter a B");
})

test("Varying Mergeable Levels", () => {
    const m1 = setMessage("Declarative", ["Please", "", "enter", "an A"]);
    const m2 = setMessage("Descriptive", ["Must", "not", "have", "B"]);
    expect(mergeIndex(m1, m2, And())).toBe(7);

    const m3 = setMessage("Declarative", ["Please", "", "enter", "an A"]);
    const m4 = setMessage("Descriptive", ["Please", "", "enter", "a B"]);
    expect(mergeIndex(m3, m4, And())).toBe(4);
})

test("'Please enter an A that does not have B; or must select a C that includes D. Please enter a B and do not enter an E'", () => {
    const m1 = setMessage("Declarative", ["Please", "", "enter", "an A"]);
    const m2 = setMessage("Descriptive", ["Must", "not", "have", "B"]);
    const m3 = setMessage("Declarative", ["Must", "", "select", "a C"]);
    const m4 = setMessage("Descriptive", ["Must", "", "include", "D" ]);
    const m5 = setMessage("Declarative", ["Please", "", "enter", "a B"]);
    const m6 = setMessage("Declarative", ["Please", "do not", "enter", "an E"]);

    merge(m1, m2, And());
    merge(m3, m4, And());
    merge(m1, m3, Or("Or"));
    merge(m1, m5, And());
    expect(m1.toString()).toBe("Please enter an A that does not have B; or must select a C that includes D. Please enter a B");

    merge(m1, m6, And());
    expect(m1.toString()).toBe("Please enter an A that does not have B; or must select a C that includes D. Please enter a B and do not enter an E");
})

test("'Please enter an A that does not have B; or must select a C that includes D. Please enter a B. Must not enter an E.'", () => {
    const m1 = setMessage("Declarative", ["Please", "", "enter", "an A"]);
    const m2 = setMessage("Descriptive", ["Must", "not", "have", "B"]);
    const m3 = setMessage("Declarative", ["Must", "", "select", "a C"]);
    const m4 = setMessage("Descriptive", ["Must", "", "include", "D" ]);
    const m5 = setMessage("Declarative", ["Please", "", "enter", "a B"]);
    const m6 = setMessage("Declarative", ["Must", "not", "enter", "an E"]);

    merge(m1, m2, And());
    merge(m3, m4, And());
    merge(m1, m3, Or("Or"));
    merge(m1, m5, And());
    expect(m1.toString()).toBe("Please enter an A that does not have B; or must select a C that includes D. Please enter a B");

    merge(m1, m6, And());
    expect(m1.toString()).toBe("Please enter an A that does not have B; or must select a C that includes D. Please enter a B. Must not enter an E");
})

test("'Shouldn't enter numbers'", () => {
    const m1 = setMessage("Descriptive", ["Should", "-n't", "enter", "numbers"]);
    expect(m1.toString()).toBe("Shouldn't enter numbers");
})

test("'Can't enter numbers or letters'", () => {
    const m1 = setMessage("Descriptive", ["Can", "-'t", "enter", "numbers"]);
    const m2 = setMessage("Descriptive", ["Can", "-'t", "enter", "letters"]);
    merge(m1, m2, Or("Or"));
    expect(m1.toString()).toBe("Can't enter numbers or letters");
})

test("'Please enter an input that has A or an input that has B'", () => {
    const m1 = setMessage("Declarative", ["Please", "", "enter", "an input"]);
    const m2 = setMessage("Descriptive", ["Must", "", "have", "A"]);
    merge(m1, m2, And());
    const m3 = setMessage("Descriptive", ["Must", "", "have", "B"]);
    merge(m1, m3, Or("Or"));
    expect(m1.toString()).toBe("Please enter an input that has A or an input that has B");
})

test("'Please enter an input that has A or an input that has B'", () => {
    const m1 = setMessage("Declarative", ["Please", "", "enter", "an input"]);
    const m2 = setMessage("Descriptive", ["Must", "", "have", "A"]);
    merge(m1, m2, And());
    const m3 = setMessage("Descriptive", ["Must", "", "have", "B"]);
    merge(m1, m3, Or("Or"));
    expect(m1.toString()).toBe("Please enter an input that has A or an input that has B");
})

test("'Must have A, B, C, and D'", () => {
    const message = mergeGroup([
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"]),
        setMessage("Descriptive", ["Must", "", "have", "C"]),
        setMessage("Descriptive", ["Must", "", "have", "D"])
    ], And());
    expect(message?.toString()).toBe("Must have A, B, C, and D");   
})

test("'Must have at least A or B'", () => {
    const message = mergeGroup([
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"])
    ], Or("At-Least"));
    expect(message?.toString()).toBe("Must have at least A or B");
})

test("'Must have at least 2 of the following: A or B'", () => {
    const message = mergeGroup([
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"])
    ], Or("At-Least", 2));
    expect(message?.toString()).toBe("Must have at least 2 of the following: A or B");
})

test("'Must have only A or B'", () => {
    const message = mergeGroup([
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"])
    ], Or("Only"));
    expect(message?.toString()).toBe("Must have only A or B");
})

test("'Must have A and/or B'", () => {
    const message = mergeGroup([
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"])
    ], Or("And-Or"));
    expect(message?.toString()).toBe("Must have A and/or B");
})

test("'Must have either A or B'", () => {
    const message = mergeGroup([
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"])
    ], Or("Either-Or"));
    expect(message?.toString()).toBe("Must have either A or B");
})

test("'Must have either 2 of the following: A, B, or C'", () => {
    const message = mergeGroup([
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"]),
        setMessage("Descriptive", ["Must", "", "have", "C"])
    ], Or("Either-Or", 2));
    expect(message?.toString()).toBe("Must have either 2 of the following: A, B, or C");
})

test("'Please enter an input that has A, B, and C'", () => {
    const message = mergeGroup([
        setMessage("Declarative", ["Please", "", "enter", "an input"]),
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"]),
        setMessage("Descriptive", ["Must", "", "have", "C"]),
    ], And());
    expect(message?.toString()).toBe("Please enter an input that has A, B, and C");
})

test("'Please enter an input that has either 2 of the following: A, B, or C'", () => {
    const message1 = setMessage("Declarative", ["Please", "", "enter", "an input"]);
    const message2 = mergeGroup([
        setMessage("Descriptive", ["Must", "", "have", "A"]),
        setMessage("Descriptive", ["Must", "", "have", "B"]),
        setMessage("Descriptive", ["Must", "", "have", "C"]),
    ], Or("Either-Or", 2));
    // It will likely not be null. However, this
    // makes the compiler happy.
    if (message2) {
        merge(message1, message2, And());
        expect(message1?.toString()).toBe("Please enter an input that has either 2 of the following: A, B, or C");
    }
})