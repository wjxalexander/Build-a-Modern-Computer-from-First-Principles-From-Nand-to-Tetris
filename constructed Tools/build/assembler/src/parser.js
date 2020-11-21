"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whichInstruction = exports.parser = void 0;
const PreReader_1 = __importDefault(require("./PreReader"));
const defaultSymbolTable_json_1 = __importDefault(require("./libs/defaultSymbolTable.json"));
async function parser(filepath) {
    const preloadCode = await PreReader_1.default(filepath);
    const symbolTable = new Map(Object.entries(defaultSymbolTable_json_1.default));
    let variablePostion = 16;
    let labelCount = 0; // label needs to remove
    function instructionAHandler(code) {
        const value = code.substring(1);
        if (!Number.isInteger(parseInt(value)) && !symbolTable.has(value)) {
            symbolTable.set(value, variablePostion++);
        }
        return code;
    }
    function labelHandler(code, index) {
        if (whichInstruction(code) === "LABEL") {
            const label = code.replace(/[\(\)]/g, "");
            if (!symbolTable.has(label)) {
                symbolTable.set(label, index - labelCount);
                labelCount++;
            }
            return '';
        }
        return code;
    }
    const map = {
        A: instructionAHandler,
        LABEL: (code) => code,
        C: (code) => code
    };
    if (!preloadCode) {
        return {};
    }
    // first scanAdd the pair (xxx, address) to the symbol table, where address is the number of the instruction following (xxx)
    const firstScanCode = preloadCode.map(labelHandler).filter(item => item);
    const instructionHandler = (code, index) => map[whichInstruction(code)](code).trim();
    return { codes: firstScanCode.map(instructionHandler).filter(ele => ele), symbolTable: symbolTable };
}
exports.parser = parser;
function whichInstruction(code) {
    if (/^\@/.test(code)) {
        return "A";
    }
    if (/^\(\S+\)$/.test(code)) {
        return "LABEL";
    }
    return "C";
}
exports.whichInstruction = whichInstruction;
