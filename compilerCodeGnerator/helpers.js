const opertationMap = {
    '+': 'add',
    '-': '-',
    '*': 'call Math.multiply 2'
}
function opertionHandler(op) {
    return opertationMap[op] || 'todo' + op
}

function flatten(arr) {
    return arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

module.exports = {
    opertionHandler,
    flatten
}