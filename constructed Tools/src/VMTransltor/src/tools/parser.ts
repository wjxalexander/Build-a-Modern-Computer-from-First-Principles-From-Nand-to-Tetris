import { ERANGE } from "constants"
import preload from "./PreReader"
import { arithemticType } from "./arithmetic"

export default async function parser(filepath: string) {
    const preloadCode = await preload(filepath)
    return preloadCode && preloadCode.map(getCommandType)
}

export function whichInstruction(code: string) {
    if (/^\@/.test(code)) {
        return "A"
    }
    if (/^\(\S+\)$/.test(code)) {
        return "LABEL"
    }
    return "C"
}

function getCommandType(commands: string) {
    const [command, segment, value] = commands.split(/\s+/)
    const map: { [k: string]: string } = {
        push: "C_PUSH",
        pop: "C_POP",
        arithmetic: "C_ARITHMETIC"
    }
    try {
        const typeToCompare = command.trim().toLowerCase()
        if (arithemticType.includes(typeToCompare)) {
            return { command: typeToCompare, segment: null, value: null }
        }
        if (map[typeToCompare]) {
            return { command: map[typeToCompare], segment, value }
        } else {
            throw new Error('type not found')
        }
    } catch (error) {
        console.warn('fail to get command type:', error)
    }

}