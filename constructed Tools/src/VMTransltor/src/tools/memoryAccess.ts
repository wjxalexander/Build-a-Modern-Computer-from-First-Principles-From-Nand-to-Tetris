function pushHandler(segment: string, value: string) {
    // about push addr = seg + i, *SP = *addr, SP++
    return `
@${value}
D=A
@SP
A=M
M=D
@SP
M=M+1
`
}

function popHandler(segment: string, value: string) {
    // about pop addr = seg + i, SP-- *addr = *SP, 
    return `
@${value}
D=A
@SP
M=M-1
A=M
M=D
`
}
export default {
    C_PUSH: pushHandler,
    C_POP: popHandler
}