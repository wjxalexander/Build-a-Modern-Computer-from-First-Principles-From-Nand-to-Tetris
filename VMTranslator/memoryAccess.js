const ARGUMENT = 'argument'
const CONSTANT = 'constant'
const LOCAL = 'local'
const POINTER = 'pointer'
const STATIC = 'static'
const TEMP = 'temp'
const THAT = 'that'
const THIS = 'this'

const memoryMap = {
    argument: "ARG",
    local: "LCL",
    that: "THAT",
    this: "THIS"
}
const preDefinedArea = [ARGUMENT, LOCAL, THAT, THIS]
const tempPosition = 5
const pointerPositon = 3
function addressHandler(segment, value, file) {
    if (segment === CONSTANT) {
        return `@${value}\nD=A`
    }
    if (preDefinedArea.includes(segment)) {
        return `@${value}\nD=A\n@${memoryMap[segment]}\nA=M+D\nD=A`
    }
    if (segment === POINTER) {
        return `@${pointerPositon + parseInt(value)}\nD=A`
    }
    if (segment === TEMP) {
        return `@${tempPosition + parseInt(value)}\nD=A`
    }
    if (segment === STATIC) {
        const fileName = file.split("/").pop()
        return `@${fileName}.${value}\nD=A`
    }
}
function pushHandler(segment, value, file) {
    // about push addr = seg + i, *SP = *addr, SP++
    return `${addressHandler(segment, value, file)}
${segment !== CONSTANT ? `A=D\nD=M` : "\n"}
@SP
A=M
M=D
@SP
M=M+1
`
}

function popHandler(segment, value, file) {
    // about pop addr = seg + i, SP-- *addr = *SP, 
    if (segment === CONSTANT) {
        throw new Error("can not push const")
    }
    return `${addressHandler(segment, value, file)}
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
`
}


module.exports = {
    pushPop: {
        C_POP: popHandler,
        C_PUSH: pushHandler
    }
}