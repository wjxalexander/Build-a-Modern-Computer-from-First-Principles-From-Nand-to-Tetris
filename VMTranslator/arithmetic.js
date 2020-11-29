
const arithemticTypes = ["add", "sub", "neg", "eq", "gt", "lt", "and", "or", "not"]

const loadtwoElement = `@SP
A=M-1
D=M
A=A-1`;

const loadoneElement = `@SP
A=M-1`;

const loadStackHeadToD = `@SP
AM=M-1
D=M`

function add() {
    return `${loadtwoElement}
M=D+M
D=A+1
@SP
M=D // add done
`
}

function sub() {
    return `${loadtwoElement}
M=M-D
D=A+1
@SP
M=D
`
}
let index = 0

function compareGenerator(instruction) {
    const oldindex = index
    index++
    const truthLabel = `TRUE${oldindex}`
    const falseLabel = `FALSE${oldindex}`
    const nextCommand = `NEXT${oldindex}`
    return `${loadStackHeadToD}
@SP
AM=M-1
M=M-D
D=A
@R13
M=D
@SP
A=M
D=M
@${truthLabel}
D;${instruction}
@${falseLabel}
0;JMP
(${truthLabel})
@R13
AD=M
M=-1
@SP
M=D+1
@${nextCommand}
0;JMP
(${falseLabel})
@R13
AD=M
M=0
@SP
M=D+1
@${nextCommand}
0;JMP
(${nextCommand})
`
}

const eq = () => compareGenerator('JEQ');
const gt = () => compareGenerator('JGT');
const lt = () => compareGenerator('JLT');
const or = () => {
    return `${loadtwoElement}
M=D|M
D=A+1
@SP
M=D
`
}

const and = () => {
    return `${loadtwoElement}
M=D&M
D=A+1
@SP
M=D
`
}

const neg = () => {
    return `${loadoneElement}
M=-M
`
}
const not = () => {
    return `${loadoneElement}
M=!M
`
}

const arithmetic = {
    add, sub, neg, not, and, gt, lt, eq, or
}
module.exports = {
    arithmetic,
    arithemticTypes,
    loadStackHeadToD,
    loadoneElement
}