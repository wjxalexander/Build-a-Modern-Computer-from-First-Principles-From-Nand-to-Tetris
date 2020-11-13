import preload from "./PreReader"
import preDefinedSymbolTable from "./libs/defaultSymbolTable.json"

export async function parser(filepath: string) {
    const preloadCode = await preload(filepath)
    const symbolTable = new Map(Object.entries(preDefinedSymbolTable))
    let variablePostion = 16
    let labelCount = 0 // label needs to remove
    function instructionAHandler(code: string) {
        const value = code.substring(1)
        if (!Number.isInteger(parseInt(value)) && !symbolTable.has(value)) {
            symbolTable.set(value, variablePostion++)
        }
        return code
    }
    function labelHandler(code: string, index: number) {
        if (whichInstruction(code) === "LABEL") {
            const label = code.replace(/[\(\)]/g, "")
            if (!symbolTable.has(label)) {
                symbolTable.set(label, index - labelCount)
                labelCount++
            }
            return ''
        }
        return code
    }
    const map = {
        A: instructionAHandler,
        LABEL: (code: string) => code,
        C: (code: string) => code
    }
    if (!preloadCode) {
        return {}
    }
    // first scanAdd the pair (xxx, address) to the symbol table, where address is the number of the instruction following (xxx)
    const firstScanCode = preloadCode.map(labelHandler).filter(item => item)

    const instructionHandler = (code: string, index: number) => map[whichInstruction(code)](code).trim()

    return { codes: firstScanCode.map(instructionHandler).filter(ele => ele), symbolTable: symbolTable }
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

