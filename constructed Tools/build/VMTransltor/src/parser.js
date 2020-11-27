"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whichInstruction = void 0;
const PreReader_1 = __importDefault(require("./PreReader"));
const arithmetic_1 = require("./arithmetic");
function parser(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        const preloadCode = yield PreReader_1.default(filepath);
        return preloadCode && preloadCode.map(getCommandType);
    });
}
exports.default = parser;
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
function getCommandType(commands) {
    const [command, segment, value] = commands.split(/\s+/);
    const map = {
        push: "C_PUSH",
        pop: "C_POP",
        arithmetic: "C_ARITHMETIC"
    };
    try {
        const typeToCompare = command.trim().toLowerCase();
        if (arithmetic_1.arithemticType.includes(typeToCompare)) {
            return { command: typeToCompare, segment: null, value: null };
        }
        if (map[typeToCompare]) {
            return { command: map[typeToCompare], segment, value };
        }
        else {
            throw new Error('type not found');
        }
    }
    catch (error) {
        console.warn('fail to get command type:', error);
    }
}
