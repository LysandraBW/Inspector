import { expect, test } from "vitest";
import { Message, setMessage } from "./Message/Message";
import { bulletize, bulletPoints } from "./Message/Bullet";
import { And, Or, Xor } from "./Message/Block/Connector/Conjunction";

test("Bullet Points", () => {
    const A = setMessage("", ["Must", "not", "have", "numbers"]).toString();
    const B = setMessage("", ["Must", "not", "have", "letters"]).toString();
    const C = setMessage("", ["Must", "not", "have", "spaces"]).toString();
    const bP = bulletPoints([A, B, C], And());
    const _bP = JSON.parse(bP);
    expect(_bP).toMatchObject({
        "[\"And\",1]": [
            "Must not have numbers",
            "Must not have letters",
            "Must not have spaces"
        ]
    });
})

test("Bullet Points", () => {
    const bP1: string = bulletPoints([
        setMessage("", ["Must", "not", "have", "A"]).toString(), 
        setMessage("", ["Must", "not", "have", "B"]).toString(), 
        setMessage("", ["Must", "not", "have", "C"]).toString()
    ], And());

    const bP2: string = bulletPoints([
        setMessage("", ["Must", "", "have", "D"]).toString(), 
        setMessage("", ["Must", "not", "have", "E"]).toString(), 
        setMessage("", ["Must", "", "have", "F"]).toString()
    ], Or());

    const bP = bulletPoints([bP1, bP2], Xor());
    const _bP = JSON.parse(bP);
    expect(_bP).toMatchObject(
        {
            "[\"Xor\",1]": [
                {
                    "[\"And\",1]": [
                        "Must not have A",
                        "Must not have B",
                        "Must not have C"
                    ]
                },
                {
                    "[\"Or\",1]": [
                        "Must have D",
                        "Must not have E",
                        "Must have F"
                    ]
                },
            ]
        }
    )
})

test("Bullet Points", () => {
    const bP1: string = bulletPoints([
        setMessage("", ["Must", "not", "have", "A"]).toString(), 
        setMessage("", ["Must", "not", "have", "B"]).toString(), 
        setMessage("", ["Must", "not", "have", "C"]).toString()
    ], And());
    const bP2: string = bulletPoints([
        setMessage("", ["Must", "", "have", "D"]).toString(), 
        setMessage("", ["Must", "not", "have", "E"]).toString(), 
        setMessage("", ["Must", "", "have", "F"]).toString()
    ], Or());
    const bP3: string = bulletPoints([bP1, bP2], Xor());
    const bP4: string = bulletPoints([
        setMessage("", ["Must", "not", "have", "G"]).toString(),
        setMessage("", ["Must", "not", "have", "H"]).toString(),
        setMessage("", ["Must", "not", "have", "I"]).toString(),
        setMessage("", ["Must", "not", "have", "J"]).toString(),
    ], Or("Or", 3));
    const bP: string = bulletPoints([bP4, bP3, "Please enter an input"], And());
    const _bP = JSON.parse(bP);
    expect(_bP).toMatchObject(
        {
            "[\"And\",1]": [
                {
                    "[\"Or\",3]": [
                        "Must not have G",
                        "Must not have H",
                        "Must not have I",
                        "Must not have J"
                    ]
                },
                {
                    "[\"Xor\",1]": [
                        {
                            "[\"And\",1]": [
                                "Must not have A",
                                "Must not have B",
                                "Must not have C"
                            ]
                        },
                        {
                            "[\"Or\",1]": [
                                "Must have D",
                                "Must not have E",
                                "Must have F"
                            ]
                        },
                    ]
                },
                "Please enter an input"
            ]
        }
    )
})

test("Bulletize", () => {
    const bP1: string = bulletPoints([
        setMessage("", ["Must", "not", "have", "A"]).toString(), 
        setMessage("", ["Must", "not", "have", "B"]).toString(), 
        setMessage("", ["Must", "not", "have", "C"]).toString()
    ], And());
    const bP2: string = bulletPoints([
        setMessage("", ["Must", "", "have", "D"]).toString(), 
        setMessage("", ["Must", "not", "have", "E"]).toString(), 
        setMessage("", ["Must", "", "have", "F"]).toString()
    ], Or());
    const bP3: string = bulletPoints([bP1, bP2], Xor());
    const bP4: string = bulletPoints([
        setMessage("", ["Must", "not", "have", "G"]).toString(),
        setMessage("", ["Must", "not", "have", "H"]).toString(),
        setMessage("", ["Must", "not", "have", "I"]).toString(),
        setMessage("", ["Must", "not", "have", "J"]).toString(),
    ], Or("Or", 3));
    const bP: string = bulletPoints([bP4, bP3, "Please enter an input"], And());
    expect(bulletize(bP)).toMatchObject([
        [0, "Must have the following:"],
        [1, "Must have at least 3 of the following:"],
        [2, "Must not have G"],
        [2, "Must not have H"],
        [2, "Must not have I"],
        [2, "Must not have J"],
        [1, "Must have only 1 of the following:"],
        [2, "Must have the following:"],
        [3, "Must not have A"],
        [3, "Must not have B"],
        [3, "Must not have C"],
        [2, "Must have at least 1 of the following:"],
        [3, "Must have D"],
        [3, "Must not have E"],
        [3, "Must have F"],
        [1, "Please enter an input"]
    ])
})