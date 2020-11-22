
function pushHandler(segment: string, value: string) {
    // about push addr = seg + i, *SP = *addr, SP++
    return `
// push start
@${value}
D=A
@SP
A=M
M=D
@SP
M=M+1
// push done`
}

function popHandler(segment: string, value: string) {
    // about pop addr = seg + i, SP-- *addr = *SP, 
    return `
// pop start
@${value}
D=A
@SP
M=M-1
A=M
M=D
// pop done`
}


export const pushPop: { [key: string]: any } = {
    C_POP: popHandler,
    C_PUSH: pushHandler
}
