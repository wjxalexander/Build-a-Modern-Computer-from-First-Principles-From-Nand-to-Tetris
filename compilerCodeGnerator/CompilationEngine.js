const { tokenizer } = require("./Tokenizer")
const compilerDirectMap = require("./static/compilerHeadKeywords.json")
const { writeFile } = require("./CodeWriter")
const { opertionHandler, flatten, stringCompiler } = require("./helpers")
const { classVarDecKeyWord, functionTitles, statementsTitles, operators, statementsNeedNested } = compilerDirectMap;
function main(filePath) {
    const tokenizedCode = tokenizer(filePath)
    const { json } = tokenizedCode
    const compiledFile = compileClass(json)
    const fileArr = filePath.split('/')
    const fileName = fileArr[fileArr.length - 1].split('.')[0]
    fileArr.pop()
    writeFile(compiledFile, fileArr.join("/"), `${fileName}`, "vm")
}

let currentClassSymbolTale;
let currentFunctionSymbolTable;
let classType;
let ifLabel;
let whileLabel
function compileClass(codes) {
    const [classKeyword, className, leftBrace, ...rest] = codes
    const { content: clsKey } = classKeyword;
    const { content: lftBrace } = leftBrace
    const { content: rgtBrace } = rest.pop()

    if (clsKey !== "class" || lftBrace !== "{" || rgtBrace !== "}") {
        throw new Error("wrong class format")
    }
    currentClassSymbolTale = new Map()
    currentClassSymbolTale.set('field', [])
    classType = className.content
    const flatRet = flatten(complileClassBody(rest))
    return flatRet
}

function complileClassBody(classBody) {
    const router = {
        varStack: [],
        subroutine: []
    }
    let active = ""
    for (const token of classBody) {
        const { content } = token
        if (classVarDecKeyWord.includes(content) || functionTitles.includes(content)) {
            active = classVarDecKeyWord.includes(content) ? "varStack" : "subroutine"
            router[active].push([token])
            continue
        }
        const lastIndex = router[active].length - 1
        router[active][lastIndex].push(token)
    }

    const { varStack, subroutine } = router
    generateSymbolTable(varStack, currentClassSymbolTale)

    const subroutineResult = compileSubroutine(subroutine)

    return subroutineResult
}

const segmentsMap = {
    var: 'local'
}
function generateSymbolTable(varDecs, table) {
    if (varDecs.length === 0) {
        return
    }
    varDecs.forEach(varDec => {
        varDec.pop()
        const [kind, type, ...vars] = varDec
        const kindKey = segmentsMap[kind.content] || kind.content
        const typeKey = type.content
        vars.forEach(({ content }) => {
            if (content !== ',') {
                table.has(kindKey) ? table.get(kindKey).push({ name: content, type: typeKey }) : table.set(kindKey, [{ name: content, type: typeKey }])
            }
        })
    })
}

function compileSubroutine(routines) {
    const tokenizedRouties = routines.map(item => {

        currentFunctionSymbolTable = new Map()
        currentFunctionSymbolTable.set('local', [])
        const [methodName, funcType, routineName, ...rest] = item
        ifLabel = { name: routineName.content, value: 1 }
        whileLabel = { name: routineName.content, value: 1 }
        if (methodName.content === "method") {
            currentFunctionSymbolTable.set('argument', [{ name: 'this', type: classType }])
        }
        const compiledPramsAndBody = handleParamAndBody(rest)

        if (methodName.content === 'constructor') {
            return compileConstructor(routineName, compiledPramsAndBody)
        }
        if (methodName.content === 'method') {
            return compileMethod(routineName, compiledPramsAndBody)
        }
        return [
            `function ${classType}.${routineName.content} ${currentFunctionSymbolTable.get('local').length}`,
            ...compiledPramsAndBody
        ]
    })
    return tokenizedRouties
}

function compileConstructor(routineName, compiledPramsAndBody) {
    const thisFieldLength = currentClassSymbolTale.get('field').length
    return [
        `function ${classType}.${routineName.content} ${currentFunctionSymbolTable.get('local').length}`,
        `push constant ${thisFieldLength}`,
        'call Memory.alloc 1',
        'pop pointer 0',
        ...compiledPramsAndBody
    ]
}

function compileMethod(routineName, compiledPramsAndBody) {
    const localLength = currentFunctionSymbolTable.get('local').length

    return [
        `function ${classType}.${routineName.content} ${localLength}`,
        'push argument 0',
        'pop pointer 0',
        ...compiledPramsAndBody
    ]
}


function handleParamAndBody(codes) {
    const praramsStack = [[]]
    let braceCount = 0
    let index = 0
    while (braceCount < 2) {
        if (["(", ")"].includes(codes[index].content)) {
            braceCount++
        } else {
            const { content } = codes[index]
            content === "," ? praramsStack.push([]) : praramsStack[praramsStack.length - 1].push(codes[index])
        }
        index++
    }

    const subroutineBodyUnCompiled = codes.slice(index)
    handleArgs(praramsStack)

    const subroutineBody = handleRoutineBody(subroutineBodyUnCompiled)
    return subroutineBody
}

function sharedFunctionTableHandler(list, kindKey) {
    list.forEach(item => {
        if (item.length === 0) {
            return
        }
        const [type, varName] = item
        const translatedItem = { name: varName.content, type: type.content }
        currentFunctionSymbolTable.has(kindKey)
            ? currentFunctionSymbolTable.get(kindKey).push(translatedItem)
            : currentFunctionSymbolTable.set(kindKey, [translatedItem])
    })
}
function handleArgs(list) {
    // handle arguments
    const kindKey = 'argument'
    sharedFunctionTableHandler(list, kindKey)
}


function handleRoutineBody(list) {
    if (list.length === 0) {
        return list
    }
    const funcBody = list.slice(1, list.length - 1) // remove { and }
    const router = {
        varDecStack: [],
        statementsStack: []
    }

    for (let i = 0; i < funcBody.length; i++) {
        const { content } = funcBody[i]
        if (content === "var") {
            active = "varDecStack"
            router.varDecStack.push([funcBody[i]])
            continue
        }

        if (statementsTitles.includes(content)) {
            router.statementsStack = funcBody.slice(i)
            break
        }
        if (active === "varDecStack") {
            const lastIndex = router[active].length - 1
            router.varDecStack[lastIndex].push(funcBody[i])
        }
    }
    const { varDecStack, statementsStack } = router

    generateSymbolTable(varDecStack, currentFunctionSymbolTable)
    const statements = compileStatements(statementsStack)
    return statements
}

const statementCompileMap = {
    if: compileIf,
    let: compileLet,
    while: compileWhile,
    return: compileReturn,
    do: compliledo
}

const stamentsOnebyOne = (statement) => statementCompileMap[statement[0].content](statement)
function compileStatements(statments) {
    if (statments.length === 0) {
        return []
    }
    const groupedStatments = groupStatements(statments)

    return groupedStatments.map(stamentsOnebyOne)
}

function groupStatements(statements) {
    // need handle if and while use a stack to count {} pair
    if (statements.length === 0) {
        return []
    }
    const ret = []
    let ifwhileStack = []
    const curlyStack = []
    statements.forEach((token, index) => {
        const { content } = token
        if (statementsTitles.includes(content) && ifwhileStack.length === 0) {
            if (statementsNeedNested.includes(content)) {
                ifwhileStack.push(token)
                return
            }
            if (ifwhileStack.length === 0) {
                ret.push([token])
            }
            return
        }
        if (ifwhileStack.length) {
            ifwhileStack.push(token)
            if (content === '{') {
                curlyStack.push(token)
            }
            if (content === "}") {
                curlyStack.pop()
            }
            if (curlyStack.length === 0 && ifwhileStack[ifwhileStack.length - 1].content === "}") {
                // current if else or while is close
                if (statements[index + 1] && statements[index + 1].content === 'else') {
                    return;
                }
                ret.push(ifwhileStack)
                ifwhileStack = []
            }
            return
        }
        const lastIndex = ret.length - 1
        ret[lastIndex].push(token)
    })
    return ret
}
// compilers 

function compileLet(statements) {
    const [, varName, ...rest] = statements
    let lefthandExpressionStack = []
    let index = 0;
    for (const i of rest) {
        index++
        if (i.content === "=") {
            break
        }
        lefthandExpressionStack.push(i)
    }
    const compiledExpression = compileExpression(rest.slice(index))
    const findSegmentVar = findVars(varName.content)
    const key = findSegmentVar.key == 'field' ? 'this' : findSegmentVar.key
    if (lefthandExpressionStack.length > 0) {
        if (lefthandExpressionStack[0].content === '[' && lefthandExpressionStack[lefthandExpressionStack.length - 1].content === ']') {
            const compiledInside = compileExpression(lefthandExpressionStack.slice(1, lefthandExpressionStack.length - 1))
            return [
                `push ${key} ${findSegmentVar.index}`,
                ...compiledInside,
                'add',
                ...compiledExpression,
                'pop temp 0', // temp 0 = the value of expression2
                'pop pointer 1',
                'push temp 0',
                'pop that 0',
            ]
        }
        return 'todo'
    }

    return [
        ...compiledExpression,
        `pop ${key} ${findSegmentVar.index}`
    ]

}

function findVars(content) {
    const resultInFunctionTable = findVarIntable(content, currentFunctionSymbolTable)
    const resultInClassTable = findVarIntable(content, currentClassSymbolTale)
    return resultInFunctionTable || resultInClassTable
}

function findVarIntable(varName, table) {
    let ret;
    for (const [key, values] of table.entries()) {
        const index = values.findIndex(({ name }) => name === varName)
        const realKey = key === 'field' ? 'this' : key
        if (index >= 0) {
            ret = { key: realKey, index, term: values[index] }
            break
        }

    }
    return ret
}

function compileWhile(statements) {
    // 'while' '(' expression ')' '{' statements '}'
    const [key, leftBrace, ...rest] = statements
    let expression = []
    let whileStatements = []
    for (let i = 0; i < rest.length; i++) {
        const { content } = rest[i]
        if (content === ")" && rest[i + 1].content === "{") {
            // while(xxx ){....
            expression = rest.slice(0, i)
            whileStatements = rest.slice(i + 2, rest.length - 1)
            break;
        }
    }
    const labelone = `WHILE_${whileLabel.name}_CON_${whileLabel.value}`
    const labeltwo = `WHILE_${whileLabel.name}_END_${whileLabel.value}`
    whileLabel.value++

    const compiledExpression = compileExpression(expression)
    const compiledWhileSts = compileStatements(whileStatements) // recursive compile statements while statement in while

    return [
        `label ${labelone}`,
        ...compiledExpression,
        'not',
        `if-goto ${labeltwo}`,
        ...compiledWhileSts,
        `goto ${labelone}`,
        `label ${labeltwo}`
    ]
}
function compileReturn(statements) {
    // 'return' expression? ';'
    const [, ...expression] = statements
    return [...compileExpression(expression), 'return']
}

function compileIf(statements) {
    // if' '(' expression ')' '{' statements '}'('else' '{' statements '}')?
    const [ifKeyp, leftBrace, ...rest] = statements
    let expression = []
    let ifElseMixed = []
    for (let i = 0; i < rest.length; i++) {
        const { content } = rest[i]
        if (content === ")" && rest[i + 1].content === "{") {
            // while(xxx ){....\
            ifLeftCurly = i + 1
            expression = rest.slice(0, i)
            ifElseMixed = rest.slice(i + 1)
            break;
        }
    }
    const curlyStack = []
    let ifStatements = []
    let elseStatements = []
    let whichPart = 1 // 1 is if statement 2 is else stament
    for (let i = 0; i < ifElseMixed.length; i++) {
        const token = ifElseMixed[i]
        const { content } = token
        if (content === "{") {
            curlyStack.push(token)
        }
        if (whichPart === 1) {
            ifStatements.push(token)
        }
        if (whichPart === 2) {
            elseStatements.push(token)
        }
        if (content === "}") {
            curlyStack.pop()
            if (curlyStack.length === 0) {
                whichPart = 2
            }
        }
    }

    const compiledExpression = compileExpression(expression)
    const compiledIfStatements = compileStatements(ifStatements.slice(1, ifStatements.length - 1));
    const compiledElseStatements = compileStatements(elseStatements.slice(2, elseStatements.length - 1));
    const labelone = `IF_${ifLabel.name}_IF_${ifLabel.value} `
    const labeltwo = `IF_${ifLabel.name}_ELSE_${ifLabel.value} `
    ifLabel.value++
    const ifPart = [...compiledExpression, 'not', `if-goto ${labelone} `, ...compiledIfStatements,]
    return compiledElseStatements.length > 0 ? [
        ...ifPart,
        `goto ${labeltwo} `,
        `label ${labelone} `,
        ...compiledElseStatements,
        `label ${labeltwo} `
    ] : [...ifPart, `label ${labelone} `,]
}


function compliledo(statement) {
    // 'do' subroutineCall ';'
    const [, ...rest] = statement
    rest.pop()
    const compiledsubCall = subCallTerm(rest)
    return [...compiledsubCall, 'pop temp 0']
}

function compileExpression(list) {
    if (list.length === 0) {
        return []
    }
    if (list.length === 1) {
        const { content } = list[0]
        if (content !== ";") {
            return flatten([
                compileTerm(list),
            ])
        }
        // return ;???
        return ['push constant 0']
    }

    const router = {
        first: [],
        op: null,
        second: []
    }

    if (list.length === 2 && ["-", "~"].includes(list[0].content)) {
        // unary term
        return compileTerm(list)
    }

    if (list[list.length - 1].content === ";") {
        list.pop()
    }
    if (list.length === 1) {
        return compileTerm(list)
    }
    let stackcount = 0
    const isexpressions = [...operators, "("]
    for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const { content } = item
        if (content === "(") {
            stackcount++
            continue
        }
        if (content === ')') {
            stackcount--
            continue
        }
        if (isexpressions.includes(content)) {
            if (stackcount > 0) {
                continue
            }
            if (stackcount === 0) {
                router.op = item
                router.first = list.slice(0, i)
                router.second = list.slice(i + 1)
                break;
            }
        }
    }

    if (router.first.length === 0) {
        if (!operators.includes(list[0].content)) {
            router.first = list.slice(0)
        } else {
            router.op = list[0]
            router.second = list.slice(1)
        }
    }
    const { first, op, second } = router
    const flatFirst = flatten(first)

    const leftTerm = compileTerm(flatFirst)
    const rightTerm = compileTerm(flatten(second))

    if (leftTerm.length > 0 && op && rightTerm.length > 0) {
        return flatten([
            leftTerm,
            rightTerm,
            opertionHandler(op.content),
        ])
    }
    if (leftTerm.length > 0 && !op) {
        return flatten([leftTerm])
    }
    return flatten([
        rightTerm,
        opertionHandler(op.content)
    ])
}
function compileTerm(term) {
    if (!term || term.length === 0) {
        return []
    }
    const [first, ...rest] = term
    if (first.content === "(" && rest[rest.length - 1].content === ")") {
        const expression = term.slice(1, term.length - 1)
        const compiledExpr = compileExpression(expression)
        return compiledExpr
    }
    if (term.length === 0) {
        return ""
    }
    if (term.length === 1) {
        // integerConstant | stringConstant | keywordConstant | varName 
        const { content, tag } = term[0];
        if ('integerConstant' === tag) {
            return [`push constant ${content}`]
        }
        if ('identifier' === tag) {
            const findSegmentVar = findVars(term[0].content)
            const key = findSegmentVar.key === 'field' ? 'this' : findSegmentVar.key
            return [`push ${key} ${findSegmentVar.index}`]
        }
        if ('stringConstant' === tag) {
            return stringCompiler(content)
        }
        if ('keyword' === tag) {
            if (content === 'true') {
                return ['push constant 1', 'neg']
            }
            if (['false', 'null'].includes(content)) {
                return ['push constant 0']
            }
            if (content === 'this') {
                return ['push pointer 0']
            }
        }
        return `${content}`
    }
    if (term.length === 2) {
        const [unaryOp, toDoterm] = term
        //unaryOp term
        const unaryOpMap = {
            "-": 'neg',
            "~": 'not'
        }
        const compiledTodo = compileTerm([toDoterm])
        return [
            compiledTodo,
            unaryOpMap[unaryOp.content]
        ]
    }
    if (term[1].content === "[" && term[term.length - 1].content === "]") {
        // varName '[' expression ']' 
        const findSegmentVar = findVars(term[0].content)
        const key = findSegmentVar.key == 'field' ? 'this' : findSegmentVar.key
        const compiledInside = compileExpression(term.slice(2, term.length - 1))

        return [
            `push ${key} ${findSegmentVar.index}`,
            ...compiledInside,
            'add',
            'pop pointer 0',
            'push that 0'
        ]
    }
    return subCallTerm(term)
}

function subCallTerm(term) {
    let leftCurly = null;
    let rightCurly = null;
    let i = 0;
    let j = term.length - 1;
    while (leftCurly === null || rightCurly === null && j > -1 && i < term.length) {
        if (term[i].content === "(" && leftCurly === null) {
            leftCurly = i
        }
        if (term[j].content === ")" && rightCurly === null) {
            rightCurly = j
        }
        i++
        j--
    }
    const toCompliledExpress = []
    let startpoint = 0
    const expressionList = term.slice(leftCurly + 1, rightCurly)

    expressionList.forEach(({ content }, index) => {
        if (content === ",") { // seperate params
            toCompliledExpress.push(expressionList.slice(startpoint, index))
            startpoint = index + 1
        }
    });

    toCompliledExpress.push(expressionList.slice(startpoint))

    const compiledExpressionList = toCompliledExpress.map((item, index) => {
        // return [...compileExpression(item), ' <symbol> , </symbol>']
        return compileExpression(item)
    })
    // compiledExpressionList.pop() // map will lead an extra ","
    const calleeHandler = term.slice(0, leftCurly).reduce((pre, cur) => {
        return pre + cur.content
    }, "");
    const arguLength = toCompliledExpress.filter(item => item.length > 0).length
    const compiledExp = methodOrFuncCompiler(calleeHandler, flatten(compiledExpressionList), arguLength)
    return compiledExp
}

function methodOrFuncCompiler(term, compiledExpressionList, arguLength) {
    const objCallRegex = /^[a-z]+\..*/i // xxxx.xxx
    let varsNumber = arguLength
    let isMethod = false
    let findInstanceInClsTable = null
    const [objName, objMethod] = term.split('.')
    if (objCallRegex.test(term)) {
        findInstanceInClsTable = findVars(objName)
        if (findInstanceInClsTable) {
            isMethod = true
        }
    } else {
        isMethod = true
    }
    if (isMethod) {
        varsNumber++
        if (!findInstanceInClsTable) {
            // directly invoke method in same class
            findInstanceInClsTable = { key: "pointer", index: 0, term: { type: classType } }
        }
    }

    return isMethod ? [
        `push ${findInstanceInClsTable.key} ${findInstanceInClsTable.index}`,
        ...compiledExpressionList,
        `call ${findInstanceInClsTable.term.type}.${objMethod || objName} ${varsNumber}`
    ] : [...compiledExpressionList, `call ${term} ${varsNumber}`]
}

// main('./compilerCodeGnerator/tests/Seven/Main.jack')
// main('./compilerCodeGnerator/tests/ConvertToBin/Main.jack')
// main('./compilerCodeGnerator/tests/Square/Main.jack')
// main('./compilerCodeGnerator/tests/Square/Square.jack')
// main('./compilerCodeGnerator/tests/Square/SquareGame.jack')
// main('./compilerCodeGnerator/tests/Average/Main.jack')
// main('./compilerCodeGnerator/tests/Pong/Main.jack')
// main('./compilerCodeGnerator/tests/Pong/Ball.jack')
// main('./compilerCodeGnerator/tests/Pong/Bat.jack')
// main('./compilerCodeGnerator/tests/Pong/PongGame.jack')
main('./compilerCodeGnerator/tests/ComplexArrays/Main.jack')
module.exports = {
    main
}