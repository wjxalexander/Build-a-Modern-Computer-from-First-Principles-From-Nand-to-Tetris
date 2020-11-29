const { loadStackHeadToD } = require('./arithmetic')
const GOTO = 'goto'
const IFGOTO = 'if-goto'
const LABEL = 'label'

const branchTypes = [GOTO, IFGOTO, LABEL]

function labelHandler(label){
    return `(${label})`
}

function ifGotoHandler(label){
    return`${loadStackHeadToD}
@${label}
D;JNE`
}
function gotoHandler(label){
    return `@${label}
0;JMP`
}

const conditionHandler = {
    [GOTO]: gotoHandler,
    [IFGOTO]: ifGotoHandler,
    [LABEL]: labelHandler
}
module.exports = {
    branchTypes,
    conditionHandler
}