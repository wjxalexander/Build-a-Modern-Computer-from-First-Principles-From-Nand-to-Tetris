import * as fs from "fs";
import * as path from "path"
import ALUInstructions from "./libs/compTable.json"
import { whichInstruction, parser } from "./parser"
const { comp, dest, jump } = ALUInstructions
class Assembler {
    symbolTable: Map<string, number>;
    codesArray: string[] | undefined;
    machineCodes: string[]
    constructor() {
        this.codesArray = []
        this.symbolTable = new Map()
        this.machineCodes = []
    }
    async loadCodes(filepath: string) {
        const { codes, symbolTable } = await parser(filepath)
        if (!codes || !symbolTable) {
            return
        }
        this.symbolTable = symbolTable
        this.codesArray = codes
    }

    handleAinstructions(code: string, i: number) {
        const value = code.substring(1)
        const binaryValue = Number.isInteger(parseInt(value)) ? parseInt(value) : this.symbolTable.get(value)
        if (typeof binaryValue === "number") {
            this.machineCodes[i] = `0${binaryValue.toString(2)}`.padStart(16, "0")
        }
    }
    handleCinstructions(code: string, i: number) {
        try {
            const destIdx = code.indexOf("=");
            const cmpIdx = code.indexOf(";")
            const destChars = code.substring(0, destIdx) as keyof typeof dest || "null"
            const cmpChars = cmpIdx === -1 ? code.substring(destIdx + 1) as keyof typeof comp : code.substring(destIdx, cmpIdx) as keyof typeof comp
            const jumpChars = cmpIdx === -1 ? "null" : code.substring(cmpIdx + 1) as keyof typeof jump
            this.machineCodes[i] = `111${comp[cmpChars]}${dest[destChars]}${jump[jumpChars]}`.padStart(16, "0")
        } catch (error) {
            throw new Error(error)
        }
    }

    handleInstructions() {
        const methodMap = {
            A: this.handleAinstructions,
            C: this.handleCinstructions,
            LABEL: () => { }
        }
        this.codesArray && this.codesArray.length > 0
            && this.codesArray.forEach((code, index) => methodMap[whichInstruction(code)].call(this, code, index))
    }
}

async function main(filepath: string) {
    const assembler = new Assembler()
    await assembler.loadCodes(filepath + ".asm")
    assembler.handleInstructions()
    const arr = assembler.machineCodes
    const fileSrtream = fs.createWriteStream(path.join(__dirname, "../targetcode", `${filepath}.hack`), 'utf-8');
    fileSrtream.on('error', function (err) { console.log(err) });
    arr.forEach((v) => fileSrtream.write(v + '\n'));
    fileSrtream.end();
}
// main('Add')
// main('Max')
// main('Rect')
// main('Pong')

export default Assembler