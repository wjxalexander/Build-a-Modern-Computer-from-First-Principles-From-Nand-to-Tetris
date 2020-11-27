"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushPop = void 0;
const ARGUMENT = 'argument';
const CONSTANT = 'constant';
const LOCAL = 'local';
const POINTER = 'pointer';
const STATIC = 'static';
const TEMP = 'temp';
const THAT = 'that';
const THIS = 'this';
const memoryMap = {
    argument: "ARG",
    local: "LCL",
    that: "THAT",
    this: "THIS"
};
const preDefinedArea = [ARGUMENT, LOCAL, THAT, THIS];
const tempPosition = 5;
const pointerPositon = 3;
function addressHandler(segment, value, file) {
    if (segment === CONSTANT) {
        return `@${value}\nD=A`;
    }
    if (preDefinedArea.includes(segment)) {
        return `@${value}\nD=A\n@${memoryMap[segment]}\nA=M+D\nD=A`;
    }
    if (segment === POINTER) {
        return `@${pointerPositon + parseInt(value)}\nD = A`;
    }
    if (segment === TEMP) {
        return `@${tempPosition + parseInt(value)}\nD = A`;
    }
    if (segment === STATIC) {
        return `@${file}.${value}\nD=A `;
    }
}
function pushHandler(segment, value, file) {
    // about push addr = seg + i, *SP = *addr, SP++
    return `
// push start
${addressHandler(segment, value, file)}
${segment !== CONSTANT ? `A=D\nD=M` : "\n"}
@SP
A=M
M=D
@SP
M=M+1
// push done`;
}
function popHandler(segment, value, file) {
    // about pop addr = seg + i, SP-- *addr = *SP, 
    if (segment === CONSTANT) {
        throw new Error("can not push const");
    }
    return `
// pop start
${addressHandler(segment, value, file)} // addr
@R14
M=D
@SP
M=M-1
A=M
D=M
@R14
A=M
M=D
@R14
M=0
// pop done`;
}
exports.pushPop = {
    C_POP: popHandler,
    C_PUSH: pushHandler
};
