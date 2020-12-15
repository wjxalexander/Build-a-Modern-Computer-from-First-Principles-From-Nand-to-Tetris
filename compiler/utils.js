function handleParamAndBody(codes) {
    const praramsStack = []
    let braceCount = 0
    let index = 0
    while (braceCount < 2) {
        if (["(", ")"].includes(codes[index].content)) {
            braceCount++
        } else {
            praramsStack.push(codes[index])
        }
        index++
    }
    const subroutineBodyUnCompiled = codes.slice(index)
    const parameterList = handleParams(praramsStack)
    const subroutineBody = handleRoutineBody(subroutineBodyUnCompiled)
    return parameterList.concat(subroutineBody)
}

function flatten(arr) {
    return arr.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}


module.exports = {
    handleParamAndBody,
    flatten
}