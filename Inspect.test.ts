import { expect, test } from "vitest";
import inspect from "./Inspect/Inspect.ts";
import { inValues, isName } from "./Inspect/Inspectors.ts";

test("Failed Inspection: Is Name", async () => {
    const inspector = isName();
    const inspectionTest = await inspector.inspect("Bobby");
    expect(inspectionTest).toMatchObject([true]);
})

test("Passed Inspection: Is Name", async () => {
    const inspector = isName();
    const inspectionTest = await inspector.inspect("B0bby");
    expect(inspectionTest).toMatchObject([false, "Must have no numbers"]);
})

test("Passed Inspection: Optional Value, No Value", async () => {
    const inspector = isName({optional: true});
    const inspectionTest = await inspector.inspect("");
    expect(inspectionTest).toMatchObject([true]);
})

test("Failed Inspection: Optional Value, Value", async () => {
    const inspector = isName({optional: true});
    const inspectionTest = await inspector.inspect("B0b!");
    expect(inspectionTest).toMatchObject([false, "Must have no numbers or no symbols"]);
})

test("Passing in Data", async () => {
    const inspector = inValues({values: ["red", "blue", "yellow"]});
    const inspectionTest = await inspector.inspect(["red"]);
    expect(inspectionTest).toMatchObject([true]);
})

test("Passing in Data", async () => {
    const inspector = inValues({values: ["red", "blue", "yellow"]});
    const inspectionTest = await inspector.inspect(["green"]);
    expect(inspectionTest).toMatchObject([false, "Please select a value"]);
})

test("Inspect", async () => {
    const info = await inspect({
        inputValues: {
            name: "John Smith",
            color: ["red"]
        },
        getInspector: (inputName) => {
            switch (inputName) {
                case "name":
                    return isName();
                case "color":
                    return inValues({values: [
                        "red", 
                        "blue", 
                        "yellow"
                    ]});
                default:
                    return null;
            }
        }
    });
    expect(info).toMatchObject({
        grade: true,
        failed: [],
        output: {}
    });
})

test("Inspect", async () => {
    const info = await inspect({
        inputValues: {
            name: "John Smith",
            color: ["green"]
        },
        getInspector: (inputName) => {
            switch (inputName) {
                case "name":
                    return isName();
                case "color":
                    return inValues({values: ["red", "blue", "yellow"]});
                default:
                    return null;
            }
        }
    });
    expect(info).toMatchObject({
        grade: false,
        failed: ["color"],
        output: {color: "Please select a value"}
    });
})