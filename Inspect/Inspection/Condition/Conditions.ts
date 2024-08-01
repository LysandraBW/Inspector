import { Condition } from "./Condition";
import { setMessage } from "../../../Message/Message";

type MessageType = [string, string, string, string];

export const noNumbers = (message: MessageType = ["Must", "", "have", "no numbers"]): Condition => {
    return new Condition(
        async (v: string) => !v.toString().match(/[0-9]/),
        setMessage("Descriptive", message)
    )
}

export const noSymbols = (message: MessageType = ["Must", "", "have", "no symbols"]): Condition => {
    return new Condition(
        async (v: string) => !v.toString().match(/[^\w\s]/),
        setMessage("Descriptive", message)
    )
}

export const isEmailAddress = (message: MessageType = ["Please", "", "enter", "a valid email address"]): Condition => {
    return new Condition(
        async (v: string) => !!v.toString().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        setMessage("Declarative", message)
    )
}

export const isPhoneNumber = (message: MessageType = ["Please", "", "enter", "a valid phone number"]): Condition => {
    return new Condition(
        async (v: string) => !!v.toString().match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
        setMessage("Declarative", message)
    )
}

export const isNumber = (message: MessageType = ["Please", "", "enter", "a number"]): Condition => {
    return new Condition(
        async (v: string) => !v ? false : !!v.toString().match(/^[1-9][\d]*$/),
        setMessage("Declarative", message)
    )
}

export const isVIN = (message: MessageType = ["Please", "", "enter", "a VIN"]): Condition => {
    return new Condition(
        async (v: string) => !!v.toString().match(/^[A-HJ-NPR-Z0-9]{17}$/),
        setMessage("Declarative", message)
    )
}

export const isLicensePlate = (message: MessageType = ["Please", "", "enter", "a license plate"]): Condition => {
    return new Condition(
        async (v: string) => !!v.toString().match(/^([\w]{6}|[\w]{7}|[\w]{8})$/i),
        setMessage("Declarative", message)
    )
}

export const isDecimal = (message: MessageType = ["Please", "", "enter", "a number"]): Condition => {
    return new Condition(
        async (v: string) => !!v.toString().match(/^\d*\.?\d*$/),
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

export const hasLength = (length: number, message: MessageType = ["Must", "have", "", "given length"]): Condition => {
    return new Condition(
        async (v: string) => v.length === length,
        setMessage("Descriptive", message)
    )
}

export const isDateTime = (message: MessageType = ["Please", "", "enter", "a valid date and time"]): Condition => {
    return new Condition(
        async (v: string) => !!v.match(/((202[0-9])|(19[7-9][0-9]))-((0[1-9])|(1[0-2]))-(([0-2][0-9])|(3[0-1]))T(([0-1][0-9])|(2[0-4])):[0-5][0-9](Z?)/),
        setMessage("Declarative", message)
    );
}

export const every = (callback: (v: any) => Promise<boolean>, message: MessageType = ["Please", "", "enter", "valid input"]): Condition => {
    return new Condition(
        async (v: Array<any>) => !!v.every(callback),
        setMessage("Declarative", message) 
    )
}