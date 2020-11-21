import { type } from "os"
import preload from "./PreReader"
import { arithemticType } from "./tools/arithmetic"

export default async function parser(filepath: string) {
    const preloadCode = await preload(filepath)

    return preloadCode?.map(item => {
        const [command, segment, value] = item.split(/\s+/)
        return { command: getCommandType(command), segment, value }
    })
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

function getCommandType(typeString: string) {
    const map: { [k: string]: string } = {
        push: "C_PUSH",
        pop: "C_POP",
        arithmetic: "C_ARITHMETIC"
    }
    try {
        const typeToCompare = typeString.trim().toLowerCase()
        if (arithemticType.includes(typeToCompare)) {
            return map.arithmetic
        }
        return map[typeString] ? map[typeString] : new Error("type not found")
    } catch (error) {
        console.warn('fail to get command type:', error)
    }

}