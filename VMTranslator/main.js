const { parser } = require('./parser');
const { pushPop } = require('./memoryAccess');
const { arithmetic } = require('./arithmetic');
const { conditionHandler } = require('./branchHandler');
const { fnGernerator, rnHandler, callHandeler } = require('./functionHandler')
const { writePushPop } = require('./writeCode');

function main(filepath) {
    const preName = filepath.split('/').pop()
    let totalRet = []
    const parsedCommands = parser(filepath)
    if (parsedCommands) {
        const ret = parsedCommands.map((item) => {
            const {
                command,
                segment,
                value
            } = item
            if (pushPop[command]) {
                return writePushPop(item, preName)
            }
            if (arithmetic[command]) {
                return arithmetic[command]()
            }
            if (conditionHandler[command]) {
                return conditionHandler[command](segment)
            }
            if (command==='function') {
                return fnGernerator(segment, value, preName)
            }
            if(command === "return"){
                return rnHandler()
            }
            if(command === "call"){
                return callHandeler(segment, value, preName)
            }
        })
        totalRet = totalRet.concat(ret)
        return totalRet
    }
}

module.exports = {
    main
}
