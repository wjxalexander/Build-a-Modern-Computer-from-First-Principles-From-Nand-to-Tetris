/**
 * (functionName) // using a translator-generated label
 * repeat nVars times: // nVars = number of local variables
 * push 0 // initializes the local variables to 0
 * ...code generate by translator
 * **/
const { CONSTANT } = require('./memoryAccess')
const { writePushPop } = require('./writeCode')
const { memoryMap } = require('./memoryAccess')
const { loadoneElement } = require('./arithmetic')

function fnGernerator(name, arg, file) {
    // get nVars needs tobe excute n times push 0 to stack
    let ret = ""
    console.log(file)
    if (file.includes("Sys")) {
        ret += initSys()
    }
    let parsedArg = parseInt((arg))
    const pushZeroCommand = writePushPop({ command: "C_PUSH", segment: CONSTANT, value: 0 }, file)
    ret += `(${name})\n`
    while (parsedArg-- > 0) {
        ret += `${pushZeroCommand}\n`
    }
    return ret
}
// return handler
function rnHandler() {
    const endFrameSymobl = 'ENDFRAME'
    const returnAddressSymbol = 'RETURNADDRESS'
    // endFrame = lcl
    const endFrame = `@${memoryMap.local}\nD=M\n@${endFrameSymobl}\nM=D\n`
    // returnAddress = endframe - 5 
    const returnAddr = `@5\nA=D-A\nD=M\n@${returnAddressSymbol}\nM=D\n`
    // *arg = pop()
    const argAddr = `${loadoneElement}\nD=M\n@${memoryMap.argument}\nA=M\nM=D\n`
    // SP = arg +1 
    const newSp = `@${memoryMap.argument}\nD=M+1\n@SP\nM=D\n`
    const recoverThat = recoverSegment(endFrameSymobl, memoryMap.that, 1)
    const recoverThis = recoverSegment(endFrameSymobl, memoryMap.this, 2)
    const recoverArg = recoverSegment(endFrameSymobl, memoryMap.argument, 3)
    const recoverLcl = recoverSegment(endFrameSymobl, memoryMap.local, 4)
    // goto returnaddress
    const gotoReturn = `@${returnAddressSymbol}\nA=M\n0;JMP\n`
    return endFrame + returnAddr + argAddr + newSp + recoverThat + recoverThis + recoverArg + recoverLcl + gotoReturn
}

function recoverSegment(endFrame, segment, gap) {
    return `@${endFrame}\nD=M\n@${gap}\nA=D-A\nD=M\n@${segment}\nM=D\n`
}
function callHandeler(name, arg) {
    const returnAddr = generateReturnAddress(name)
    const pushReturnAddr = `@${returnAddr}\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1\n`
    const pushLCL = memorizeSegment(memoryMap.local)
    const pushARG = memorizeSegment(memoryMap.argument)
    const pushTHIS = memorizeSegment(memoryMap.this)
    const pushTHAT = memorizeSegment(memoryMap.that)
    //ARG = SP-5-nArgs  Repositions ARG
    const resetArg = `@5\nD=A\n@${arg}\nD=D+A\n@SP\nA=M\nD=A-D\n@${memoryMap.argument}\nM=D\n`
    //`@SP\nD=M\n@${arg}\nD=D-A\n@5\nD=D-A\n@${memoryMap.argument}\nM=D\n`
    //LCL = SP  Repositions LCL
    const resetLCL = `@SP\nD=M\n@${memoryMap.local}\nM=D\n`
    const gotoFunc = `@${name}\n0;JMP\n`
    return pushReturnAddr + pushLCL + pushARG + pushTHIS + pushTHAT + resetArg + resetLCL + gotoFunc + `(${returnAddr})\n`
}

function memorizeSegment(segment) {
    return `@${segment}\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\n`
}
const returnMap = new Map()

function generateReturnAddress(name) {
    if (!returnMap.get(name)) {
        returnMap.set(name, 1)
    } else {
        const value = returnMap.get(name)
        returnMap.set(name, value + 1)
    }

    return `${name}$RET.${returnMap.get(name)}`
}

function initSys() {
    // Set up SP address
    return `@256\nD=A\n@SP\nM=D\n` + callHandeler("Sys.init", 0) +`//initdone\n`
}

module.exports = {
    fnGernerator,
    rnHandler,
    callHandeler
}