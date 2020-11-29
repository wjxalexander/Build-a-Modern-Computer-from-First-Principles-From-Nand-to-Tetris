const { preload } = require('./PreReader');
const { arithemticTypes } = require('./arithmetic');
const { branchTypes } = require('./branchHandler');

const map = {
    push: "C_PUSH",
    pop: "C_POP",
    arithmetic: "C_ARITHMETIC"
}
function parser(filepath) {
    const preloadCode = preload(filepath)
    return preloadCode && preloadCode.map(getCommandType)
}

const fnRegx = new RegExp(/^function \S+/)

function getCommandType(commands) {
    const [command, segment, value] = commands.split(/\s+/)
    try {
        const typeToCompare = command.trim().toLowerCase()
        if (arithemticTypes.includes(typeToCompare)) {
            return { command: typeToCompare, segment: null, value: null }
        }
        if (map[typeToCompare]) {
            return { command: map[typeToCompare], segment, value }
        }
        if(branchTypes.includes(typeToCompare)){
            return { command: typeToCompare, segment: segment}
        }
        if (command==='function') {
            return { command, segment, value }
        }
        if(command === 'return'){
            return { command }
        }
        if(command === 'call'){
            return { command, segment, value }
        }
        else {
            throw new Error('type not found')
            // return command
        }
    } catch (error) {
        console.warn('fail to get command type:', error)
    }
}

module.exports = {
    parser
}