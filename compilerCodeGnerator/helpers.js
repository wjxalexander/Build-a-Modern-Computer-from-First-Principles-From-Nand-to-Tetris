const opertationMap = {
    '+': 'add',
    '-': 'sub',
    '*': 'call Math.multiply 2',
    '/': 'call Math.divide 2',
    '~': 'not',
    '=': 'eq',
    '&amp;': 'and',
    '&gt;': 'gt',
    '&lt;': 'lt'

}
function opertionHandler(op) {
    return opertationMap[op] || 'todo' + op + 'in inophand'
}

function flatten(arr) {
    return arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

function stringCompiler(str) {
    const stringLength = str.length
    let compiledStr = []
    for (const char of str) {
        const charCode = char.charCodeAt(0)
        compiledStr.push(`push constant ${charCode}`)
        compiledStr.push(`call String.appendChar 2`)
    }
    return [
        `push constant ${stringLength}`,
        'call String.new 1',
        ...compiledStr
    ]
}
module.exports = {
    opertionHandler,
    flatten,
    stringCompiler
}