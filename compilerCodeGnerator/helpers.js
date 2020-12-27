const opertationMap = {
    '+': 'add',
    '-': 'sub',
    '*': 'call Math.multiply 2',
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

module.exports = {
    opertionHandler,
    flatten
}