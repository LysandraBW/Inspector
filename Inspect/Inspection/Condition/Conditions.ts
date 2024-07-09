import { Condition } from "./Condition";
import { setMessage } from "../../../Message/Message";

type MessageType = [string, string, string, string];

export const noNumbers = (message: MessageType = ["Must", "", "have", "no numbers"]): Condition => {
    return new Condition(
        async (v: string) => !v.match(/[0-9]/),
        setMessage("Descriptive", message)
    )
}

export const noSymbols = (message: MessageType = ["Must", "", "have", "no symbols"]): Condition => {
    return new Condition(
        async (v: string) => !v.match(/[^\w\s]/),
        setMessage("Descriptive", message)
    )
}

export const isEmailAddress = (message: MessageType = ["Please", "", "enter", "a valid email address"]): Condition => {
    return new Condition(
        async (v: string) => !!v.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        setMessage("Declarative", message)
    )
}

export const isPhoneNumber = (message: MessageType = ["Please", "", "enter", "a valid phone number"]): Condition => {
    return new Condition(
        async (v: string) => !!v.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
        setMessage("Declarative", message)
    )
}

export const isNumber = (message: MessageType = ["Please", "", "enter", "a number"]): Condition => {
    return new Condition(
        async (v: string) => !!v.match(/^[1-9][\d]+$/),
        setMessage("Declarative", message)
    )
}

export const isVIN = (message: MessageType = ["Please", "", "enter", "a VIN"]): Condition => {
    return new Condition(
        async (v: string) => !!v.match(/^[A-HJ-NPR-Z0-9]{17}$/),
        setMessage("Declarative", message)
    )
}

export const isLicensePlate = (message: MessageType = ["Please", "", "enter", "a license plate"]): Condition => {
    return new Condition(
        async (v: string) => !!v.match(/^[\w]{6-8}$/i),
        setMessage("Declarative", message)
    )
}

export const isDecimal = (message: MessageType = ["Please", "", "enter", "a number"]): Condition => {
    return new Condition(
        async (v: string) => !!v.match(/^\d*\.?\d*$/),
        setMessage("Declarative", message)
    )
}

export const hasValue = (message: MessageType = ["Must", "", "enter", "an input"]): Condition => {
    return new Condition(
        async (v: string) => v.length >= 1,
        setMessage("Declarative", message)
    )
}

export const inValues = (values: Array<any>, message: MessageType = ["Please", "", "select", "a value"]): Condition => {
    return new Condition(
        async (v: Array<string>) => v.every(_v => values.includes(_v)) && v.length >= 1,
        setMessage("Declarative", message)
    )
}