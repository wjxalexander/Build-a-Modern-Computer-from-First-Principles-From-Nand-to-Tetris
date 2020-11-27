const { preload } = require('./PreReader');
const { arithemticType } = require('./arithmetic');

async function parser(filepath) {
    const preloadCode = await preload(filepath)
    return preloadCode && preloadCode.map(getCommandType)
}

function getCommandType(commands) {
    const [command, segment, value] = commands.split(/\s+/)
    const map = {
        push: "C_PUSH",
        pop: "C_POP",
        arithmetic: "C_ARITHMETIC"
    }
    try {
        const typeToCompare = command.trim().toLowerCase()
        if (arithemticType.includes(typeToCompare)) {
            return { command: typeToCompare, segment: null, value: null }
        }
        if (map[typeToCompare]) {
            return { command: map[typeToCompare], segment, value }
        } else {
            throw new Error('type not found')
        }
    } catch (error) {
        console.warn('fail to get command type:', error)
    }
}

module.exports = {
    parser
}