import { expect, test } from "vitest";
import { Message, setMessage } from "./Message/Message";
import { NonConnector } from "./Message/Block/Non-Connector/Non-Connector";
import { And, Or } from "./Message/Block/Connector/Conjunction";

test("Length", () => {
    expect((
        new Message(
            "Declarative", 
            new NonConnector("Declarative", "", ""
        )
    ).getLength())).toBe(1);
})

test("Length", () => {
    expect(setMessage(
            "Declarative",
            ["Must", "", "have", "numbers"]
    ).getLength()).toBe(3);
})

test("To String", () => {
    expect(setMessage(
        "Declarative",
        ["Must", "-n't", "have", "numbers"]
    ).toString()).toBe("Mustn't have numbers");
})

test("To String", () => {
    expect(setMessage(
        "Declarative",
        ["Must", "-n't", "be", "numbers"]
    ).toString()).toBe("Mustn't be numbers");
})

test("To String", () => {
    expect(setMessage(
        "Declarative",
        ["Must", "", "select", "an input"]
    ).toString()).toBe("Must select an input");
})

test("To String", () => {
    const A = new NonConnector("Declarative", "", "Must");
    const B = new NonConnector("Declarative", "", "upload");
    const C = new NonConnector("Declarative", "", "a file");
    const D = new NonConnector("Declarative", "", "in");
    const E = Or("Or");
    const F = new NonConnector("Declarative", "", "PNG");
    const G = new NonConnector("Declarative", "", "JPG");
    const H = new NonConnector("Declarative", "", "format");
    A.next = [B];
    B.next = [C];
    C.next = [D];
    D.next = [E];
    E.next = [F, G];
    F.next = [H];
    G.next = [H];
    expect((new Message(
        "Declarative", 
        A
    ).toString())).toBe("Must upload a file in PNG format or JPG format");
})

test("Locate Word Level", () => {
    expect(setMessage(
        "Declarative",
        ["A", "B", "A", "A"]
    ).locateBlockLevels(b => b.block === "A")).toMatchObject([0, 2, 3]);
})

test("Locate Word Level", () => {
    const A = And();
    const B = new NonConnector("Declarative", "", "B");
    const C = new NonConnector("Declarative", "", "C");
    const D = new NonConnector("Declarative", "", "D");
    B.next = [D];
    C.next = [D];
    A.next = [B, C];
    expect((
        new Message("Declarative", A)
    ).locateBlockLevels(b => b.block === "D")).toMatchObject([2, 2]);
})

test("Number Instances", () =>{
    expect(setMessage(
        "Declarative",
        ["A", "B", "A", "A"]
    ).numberInstances(b => b.block === "A")).toBe(3);  
})

test("Number Instances", () =>{
    expect(setMessage(
        "Declarative",
        ["A", "B", "A", "A"]
    ).numberInstances(b => b.block === "C")).toBe(0);  
})