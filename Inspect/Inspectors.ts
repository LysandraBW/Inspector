import Inspector from "./Inspector";
import { And } from "./Inspection/Connector/Connector";
import * as T from "./Inspection/Condition/Conditions";

interface InspectorData {
    [k: string]: any;
    optional?: boolean | null;
    outputType?: "Message" | "Bullet" | null;
}

export const isName = (inspectorData: InspectorData = {
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([
            T.noNumbers(), 
            T.noSymbols()
        ], "Or"),
        inspectorData.outputType || "Message",
        inspectorData.optional || false
    )
}

export const isEmailAddress = (inspectorData: InspectorData = {
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([
            T.hasValue(["Must", "", "enter", "an email address"]),
            T.isEmailAddress()
        ]),
        inspectorData.outputType || "Message",
        inspectorData.optional || false
    )
}

export const isPhoneNumber = (inspectorData: InspectorData = {
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([
            T.hasValue(["Must", "", "enter", "a phone number"]),
            T.isPhoneNumber()
        ]),
        inspectorData.outputType || "Message",
        inspectorData.optional || false
    )
}

export const isVIN = (inspectorData: InspectorData = {
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([
            T.hasValue(["Must", "", "enter", "a VIN"]),
            T.isVIN()
        ]),
        inspectorData.outputType || "Message",
        inspectorData.optional || false
    )
}

export const isLicensePlate = (inspectorData: InspectorData = {
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([
            T.hasValue(["Must", "", "enter", "a license plate"]),
            T.isLicensePlate()
        ]),
        inspectorData.outputType || "Message",
        inspectorData.optional || false
    )
}

export const isDecimal = (inspectorData: InspectorData = {
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([
            T.hasValue(["Must", "", "enter", "a decimal"]),
            T.isDecimal()
        ]),
        inspectorData.outputType || "Message",
        inspectorData.optional || false
    )
}

export const isPrice = (inspectorData: InspectorData = {
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([
            T.hasValue(["Must", "", "enter", "a price"]),
            T.isDecimal()
        ]),
        inspectorData.outputType || "Message",
        inspectorData.optional || false
    )
}

export const hasValue = (inspectorData: InspectorData = {
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([T.hasValue()]),
        inspectorData.outputType || "Message",
        inspectorData.optional || false
    )
}

export const inValues = (inspectorData: InspectorData = {
    values: [],
    optional: false, 
    outputType: "Message"
}): Inspector => {
    return new Inspector(
        And([T.inValues(inspectorData.values)]),
        inspectorData.outputType || "Message",
        inspectorData.optional || false   
    )
}