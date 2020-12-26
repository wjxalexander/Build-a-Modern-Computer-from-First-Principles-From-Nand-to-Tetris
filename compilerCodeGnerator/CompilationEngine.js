const { tokenizer } = require("./Tokenizer")
const compilerDirectMap = require("./static/compilerHeadKeywords.json")
const { writeFile } = require("./CodeWriter")
const { opertionHandler, flatten } = require("./helpers")
const { classVarDecKeyWord, functionTitles, statementsTitles, operators, statementsNeedNested } = compilerDirectMap;
function main(filePath) {
    const tokenizedCode = tokenizer(filePath)
    const { xml, json } = tokenizedCode
    const compiledFile = compileClass(json)
    const fileArr = filePath.split('/')
    const fileName = fileArr[fileArr.length - 1].split('.')[0]
    fileArr.pop()
    writeFile(compiledFile, fileArr.join("/"), `${fileName}`, "vm")
}

let currentClassSymbolTale;
let currentFunctionSymbolTable;
let classType;
function compileClass(codes) {
    const [classKeyword, className, leftBrace, ...rest] = codes
    const { content: clsKey } = classKeyword;
    const { content: lftBrace } = leftBrace
    const { content: rgtBrace } = rest.pop()
    if (clsKey !== "class" || lftBrace !== "{" || rgtBrace !== "}") {
        throw new Error("wrong class format")
    }
    currentClassSymbolTale = new Map()
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
        currentFunctionSymbolTable.set('total', 0)
        const [methodName, funcType, routineName, ...rest] = item
        if (methodName.content === "method") {
            currentFunctionSymbolTable.set('argument', [{ name: 'this', type: classType }])
            currentFunctionSymbolTable.get('total')++
        }

        return [
            `${methodName.content} ${classType}.${routineName.content} ${currentFunctionSymbolTable.get('total')}`,
            ...handleParamAndBody(rest)
        ]
        // TODO:
    })
    return tokenizedRouties
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
        currentFunctionSymbolTable.get('total')++
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
    if (lefthandExpressionStack.length > 0) {
        return [
            "<letStatement>",
            "<keyword> let </keyword>",
            "<" + `${varName.tag}> ${varName.content} </${varName.tag}>`,
            singleItemXmlTag(lefthandExpressionStack[0]),
            ...compileExpression(lefthandExpressionStack.slice(1, lefthandExpressionStack.length - 1)),
            singleItemXmlTag(lefthandExpressionStack[lefthandExpressionStack.length - 1]),
            `<symbol> = </symbol>`,
            ...compileExpression(rest.slice(index)),
            "</letStatement>"
        ]
    }

    return [
        "<letStatement>",
        "<keyword> let </keyword>",
        "<" + `${varName.tag}> ${varName.content} </${varName.tag}>`,
        '<symbol> = </symbol>',
        ...compiledExpression,
        "</letStatement>"
    ]

}
function findVarInSymbolTables(varName) {

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

    const compiledExpression = compileExpression(expression)
    const compiledWhileSts = compileStatements(whileStatements) // recursive compile statements while statement in while

    return [
        "<whileStatement>",
        singleItemXmlTag(key),
        singleItemXmlTag(leftBrace),
        ...compiledExpression,
        '<symbol> ) </symbol>',
        '<symbol> { </symbol>',
        ...compiledWhileSts,
        '<symbol> } </symbol>',
        "</whileStatement>"
    ]
}
function compileReturn(statements) {
    // 'return' expression? ';'
    const [key, ...expression] = statements

    return [
        ...compileExpression(expression),
        'return'
    ]
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

    const tokenLizedIfStatments = [
        singleItemXmlTag(ifKeyp),
        singleItemXmlTag(leftBrace),
        ...compiledExpression,
        '<symbol> ) </symbol>',
        '<symbol> { </symbol>',
        ...compiledIfStatements,
        '<symbol> } </symbol>',
    ]
    const tokenLizedElseStatments = compiledElseStatements.length === 0 ? [] : [
        '<keyword> else </keyword>',
        '<symbol> { </symbol>',
        ...compiledElseStatements,
        '<symbol> } </symbol>'
    ]
    return [
        '<ifStatement>',
        ...tokenLizedIfStatments.concat(tokenLizedElseStatments),
        '</ifStatement>'
    ]
}


function compliledo(statement) {
    // 'do' subroutineCall ';'
    const [, ...rest] = statement
    rest.pop()
    const compiledsubCall = subCallTerm(rest)
    return [
        ...compiledsubCall,
        'pop temp 0'
    ]
}

function singleItemXmlTag(item) {
    const { tag, content } = item
    return `<${tag}> ${content} </${tag}>`
}

function subCallTerm(term) {
    let leftIndex = 0;
    let rightIndex = 0;
    for (let i = 0; i < term.length; i++) {
        if (term[i].content === "(") {
            leftIndex = i;
        }
        if (term[i].content === ")") {
            rightIndex = i;
            break;
        }
    }
    const toCompliledExpress = []
    let startpoint = 0
    const expressionList = term.slice(leftIndex + 1, rightIndex)
    expressionList.forEach(({ content }, index) => {
        if (content === ",") {
            toCompliledExpress.push(expressionList.slice(startpoint, index))
            startpoint = index + 1
        }
    });
    toCompliledExpress.push(expressionList.slice(startpoint))

    const compiledExpressionList = flatten(toCompliledExpress.map((item, index) => {
        return [...compileExpression(item), ' <symbol> , </symbol>']
    }))

    compiledExpressionList.pop()
    const leftPart = term.slice(0, leftIndex + 1).map(singleItemXmlTag)
    const rightPart = term.slice(rightIndex).map(singleItemXmlTag)

    return [...leftPart, "<expressionList>", ...compiledExpressionList, "</expressionList>", ...flatten(rightPart)]
}




function compileExpression(list) {
    if (!Array.isArray(list) && list) {
        return [`<expression>\n${compileTerm([list])}\n</expression>`]
    }
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
        return flatten([
            '<expression>',
            compileTerm(list),
            '</expression>'
        ])
    }

    if (list[list.length - 1].content === ";") {
        list.pop()
    }

    const stack = []
    let tempStack = []
    const isexpressions = [...operators, "("]
    list.forEach((item, index) => {
        const { content } = item
        const lastItem = list[index - 1]
        const isExpressBrace = !lastItem || isexpressions.includes(lastItem.content)
        // (expreess) || + (xxx)|| *(1 + (xxx))
        if (content === "(") {
            if (isExpressBrace) {
                stack.push(item)
            } else {
                tempStack.push(item)
            }
            return
        }

        if (!["(", ")"].includes(content)) {
            if (operators.includes(content) && stack.length > 0) {
                tempStack.push(item)
            }
            if (!operators.includes(content)) {
                tempStack.push(item)
            }
        }
        if (operators.includes(content) && stack.length === 0) {
            if (router.first.length === 0) {
                router.first = [...tempStack]
                tempStack = []
            }
            router.op = item
        }
        if (content === ")") {
            if (stack.length === 0) {
                tempStack.push(item)
                return
            }
            const lastLeftCurlyBrace = stack.pop()
            let whickOp = router.op ? 'second' : 'first'
            if (router[whickOp].length === 0) {
                router[whickOp].push([lastLeftCurlyBrace, ...tempStack, item])
            } else {
                router[whickOp] = [lastLeftCurlyBrace, ...router[whickOp], ...tempStack, item]
            }
            tempStack = []
        }
    })
    if (router.op && router.second.length === 0) {
        router.second = router.second.concat(...tempStack)
    }
    if (!router.op && router.first.length === 0) {
        router.first = router.first.concat(...tempStack)
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
        opertionHandler(op)
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
            return `push constant ${content}`
        }
        return `todo: ${content}, ${tag}`
    }
    if (term.length === 2) {
        const [unaryOp, toDoterm] = term
        //unaryOp term
        return `<term>\n${singleItemXmlTag(unaryOp)}\n ${compileTerm([toDoterm])}\n</term>`
    }
    if (term[1].content === "[" && term[term.length - 1].content === "]") {
        // varName '[' expression ']' 
        return `<term>\n${singleItemXmlTag(term[0])}\n${singleItemXmlTag(term[1])}\n ${compileExpression(term.slice(2, term.length - 1)).join("\n")}\n${singleItemXmlTag(term[term.length - 1])}\n</term>`
    }
    return `<term>\n${subCallTerm(term).join("\n")}\n</term>`
}

function subCallTerm(term) {
    let leftCurly = null;
    let rightCurly = null;
    let i = 0;
    let j = term.length - 1
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
    const leftPart = term.slice(0, leftCurly).reduce((pre, cur) => {
        return pre + cur.content
    }, 'call ')
    const localArgLength = compiledExpressionList.length
    return [
        ...flatten(compiledExpressionList),
        `${leftPart} ${localArgLength}`
    ]
}
// main('./compilerCodeGnerator/tests/Seven/Main.jack')
// main('./compilerCodeGnerator/tests/Square/Square.jack')
// main('./compilerCodeGnerator/tests/Square/Main.jack')
main('./compilerCodeGnerator/tests/ConvertToBin/Main.jack')
module.exports = {
    main
}