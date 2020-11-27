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
const fs = __importStar(require("fs"));
const parser_1 = __importDefault(require("./parser"));
const memoryAccess_1 = require("./memoryAccess");
const arithmetic_1 = require("./arithmetic");
let outputFileName = '';
const inputFileName = process.argv[2];
const isDirectory = fs.lstatSync(inputFileName).isDirectory();
if (isDirectory) {
    outputFileName = inputFileName;
    fs.readdir(inputFileName, (err, files) => {
        if (err) {
            throw err;
        }
        files.forEach(file => {
            let tempArry = file.split('.');
            if (tempArry.pop() == 'vm') {
                let preName = tempArry.join('.');
                main(outputFileName, preName);
            }
        });
    });
}
else {
    let tempArry = inputFileName.split('.');
    tempArry.pop();
    let preName = tempArry.join('.');
    console.log(preName);
    outputFileName = preName;
    main(inputFileName, preName);
}
function main(filepath, preName) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsedCommands = yield parser_1.default(filepath);
        if (parsedCommands && outputFileName) {
            const ret = parsedCommands.map((item) => {
                const { command } = item;
                if (memoryAccess_1.pushPop[command]) {
                    return writePushPop(item, preName);
                }
                if (arithmetic_1.arithmetic[command]) {
                    return arithmetic_1.arithmetic[command]();
                }
            });
            writeFile(ret);
        }
    });
}
function writePushPop(props, file) {
    const { command, segment, value } = props;
    return memoryAccess_1.pushPop[command](segment, value, file);
}
function writeFile(streams) {
    const fileSrtream = fs.createWriteStream(`${outputFileName}.asm`, 'utf-8');
    fileSrtream.on('error', function (err) { console.log(err); });
    streams.forEach((v) => fileSrtream.write(v + '\n'));
    fileSrtream.end();
}
// main("StackArithmetic/SimpleAdd/SimpleAdd.vm")
// main("StackArithmetic/StackTest/StackTest.vm")
// main("MemoryAccess/BasicTest/BasicTest.vm")
// main("MemoryAccess/PointerTest/PointerTest.vm")
// main("MemoryAccess/StaticTest/StaticTest.vm")
