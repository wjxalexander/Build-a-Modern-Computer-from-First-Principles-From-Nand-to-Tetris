"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const compTable_json_1 = __importDefault(require("./libs/compTable.json"));
const parser_1 = require("./parser");
const { comp, dest, jump } = compTable_json_1.default;
class Assembler {
    constructor() {
        this.codesArray = [];
        this.symbolTable = new Map();
        this.machineCodes = [];
    }
    async loadCodes(filepath) {
        const { codes, symbolTable } = await parser_1.parser(filepath);
        if (!codes || !symbolTable) {
            return;
        }
        this.symbolTable = symbolTable;
        this.codesArray = codes;
    }
    handleAinstructions(code, i) {
        const value = code.substring(1);
        const binaryValue = Number.isInteger(parseInt(value)) ? parseInt(value) : this.symbolTable.get(value);
        if (typeof binaryValue === "number") {
            this.machineCodes[i] = `0${binaryValue.toString(2)}`.padStart(16, "0");
        }
    }
    handleCinstructions(code, i) {
        try {
            const destIdx = code.indexOf("=");
            const cmpIdx = code.indexOf(";");
            const destChars = code.substring(0, destIdx) || "null";
            const cmpChars = cmpIdx === -1 ? code.substring(destIdx + 1) : code.substring(destIdx, cmpIdx);
            const jumpChars = cmpIdx === -1 ? "null" : code.substring(cmpIdx + 1);
            this.machineCodes[i] = `111${comp[cmpChars]}${dest[destChars]}${jump[jumpChars]}`.padStart(16, "0");
        }
        catch (error) {
            throw new Error(error);
        }
    }
    handleInstructions() {
        const methodMap = {
            A: this.handleAinstructions,
            C: this.handleCinstructions,
            LABEL: () => { }
        };
        this.codesArray && this.codesArray.length > 0
            && this.codesArray.forEach((code, index) => methodMap[parser_1.whichInstruction(code)].call(this, code, index));
    }
}
async function main(filepath) {
    const assembler = new Assembler();
    await assembler.loadCodes(filepath + ".asm");
    assembler.handleInstructions();
    const arr = assembler.machineCodes;
    const fileSrtream = fs.createWriteStream(path.join(__dirname, "../targetcode", `${filepath}.hack`), 'utf-8');
    fileSrtream.on('error', function (err) { console.log(err); });
    arr.forEach((v) => fileSrtream.write(v + '\n'));
    fileSrtream.end();
}
main('Add');
main('Max');
main('Rect');
main('Pong');
exports.default = Assembler;
