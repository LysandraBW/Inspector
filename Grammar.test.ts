import { expect, test } from "vitest";
import { setMessage } from "./Message/Message";
import { Or } from "./Message/Block/Connector/Conjunction";
import { toRelativeClause, thirdPersonSingularVerb, connectClauses } from "./Message/Grammar";

test("Third Person Singular Verb", () => {
    expect(thirdPersonSingularVerb("have")).toBe("has");
})

test("Third Person Singular Verb", () => {
    expect(thirdPersonSingularVerb("select")).toBe("selects");
})

test("Third Person Singular Verb", () => {
    expect(thirdPersonSingularVerb("satisfy")).toBe("satisfies");
})

test("Third Person Singular Verb", () => {
    expect(thirdPersonSingularVerb("match")).toBe("matches");
})

test("Connect Clauses", () => {
    expect(connectClauses([
        "Must have numbers", 
        "Must have letters"
    ], Or(";"))).toBe("Must have numbers; or must have letters");
})

test("To Relative Clause", () => {
    const m = setMessage(
        "Descriptive", 
        ["Must", "", "be in", "PNG format"]
    );
    toRelativeClause(m);
    expect(m.toString()).toBe("that is in PNG format");
})

test("To Relative Clause", () => {
    const m = setMessage(
        "Descriptive", 
        ["Must", "", "end with", "'.edu'"],
    );
    toRelativeClause(m);
    expect(m.toString()).toBe("that ends with '.edu'");
})

test("To Relative Clause", () => {
    const m = setMessage(
        "Descriptive", 
        ["Must", "not", "end with", "'.edu'"],
    );
    toRelativeClause(m);
    expect(m.toString()).toBe("that does not end with '.edu'");
})