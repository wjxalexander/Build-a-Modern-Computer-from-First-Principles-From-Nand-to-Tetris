const { tokenizer } = require("./Tokenizer")
const compilerDirectMap = require("./static/compilerHeadKeywords.json")
const { writeFile } = require("./CodeWriter")
const { classVarDecKeyWord, functionTitles, statementsTitles, operators } = compilerDirectMap;

function main(filePath) {
    const tokenizedCode = tokenizer(filePath)
    const { xml, json } = tokenizedCode
    compileClass(json)

    // const fileArr = filePath.split('/')
    // const fileName = fileArr[fileArr.length - 1].split('.')[0]
    // fileArr.pop()
    // writeFile(xml, fileArr.join("/"), `${fileName}T_my`, "xml")
}

function compileClass(codes) {
    const [classKeyword, className, leftBrace, ...rest] = codes
    const { content: clsKey } = classKeyword;
    const { content: clsName } = className
    const { content: lftBrace } = leftBrace
    const { content: rgtBrace } = rest.pop()
    if (clsKey !== "class" || lftBrace !== "{" || rgtBrace !== "}") {
        throw new Error("wrong class format")
    }
    return [
        `<class>`,
        `  <keyword> ${clsKey} </keyword>`,
        `  <identifier> ${clsName} </identifier>`,
        `  <symbol> { </symbol>`,
        ...complileClassBody(rest),
        `  <symbol> } </symbol>`,
        `</class>`
    ]
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
    const classVarDecResult = compileClassVarDec(varStack)
    const subroutineResulte = compileSubroutine(subroutine)
    console.log(router)
    return []
}

function compileClassVarDec(varDecs) {
    return varDecs.map(item => {
        return [
            `<classVarDec>`,
            ...item.map(({ tag, content }) => "  <" + `${tag}> ${content} </${tag}>`),
            `</classVarDec>`
        ]
    })
}

function compileVarDec(varDecStack) {
    return varDecStack.map(item => {
        return [
            `<varDec>`,
            ...item.map(({ tag, content }) => "  <" + `${tag}> ${content} </${tag}>`),
            `</varDec>`
        ]
    })
}

function compileSubroutine(routines) {
    const tokenizedRouties = routines.map(item => {
        const [methodName, funcType, routineName, ...rest] = item
        return [
            `<subroutineDec>`,
            "  <" + `${methodName.tag}> ${methodName.content} </${methodName.tag}>`,
            "  <" + `${funcType.tag}> ${funcType.content} </${funcType.tag}>`,
            "  <" + `${routineName.tag}> ${routineName.content} </${routineName.tag}>`,
            ...handleParamAndBody(rest),
            `</subroutineDec>`
        ]
    })
    console.log(routines)
}

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

function handleParams(list) {
    return [
        `  <symbol> ( </symbol>`,
        `  <parameterList>`,
        ...list.map(({ tag, content }) => "    <" + `${tag}> ${content} </${tag}>`),
        `  </parameterList>`,
        `  <symbol> ) </symbol>`
    ]
}

function handleRoutineBody(list) {
    if (list.length === 0) {
        return list
    }
    const funcBody = list.slice(1, list.length - 1)
    const router = {
        varDecStack: [],
        statementsStack: []
    }
    let active = ""
    for (const token of funcBody) {
        const { content } = token
        if (content === "var" || statementsTitles.includes(content)) {
            active = content === "var" ? "varDecStack" : "statementsStack"
            router[active].push([token])
            continue
        }
        const lastIndex = router[active].length - 1
        router[active][lastIndex].push(token)
    }
    const { varDecStack, statementsStack } = router
    const varDecs = compileVarDec(varDecStack)

    const statements = compileStatements(statementsStack)
    return [
        '<subroutineBody>',
        ' <symbol> { </symbol>',
        ...varDecs,
        ...statements,
        ' <symbol> } </symbol>',
        '</subroutineBody>'
    ]
}
const statementCompileMap = {
    if: compileIf,
    let: compileLet,
    while: compileWhile,
    return: compileReturn,
    do: compliledo
}

function compileStatements(statments) {
    const stamentsOnebyOne = (statement) => statementCompileMap[statement[0].content](statement)
    return [
        "<statements>",
        ...statments.map(stamentsOnebyOne),
        "</statements>"
    ]
}

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

    if (lefthandExpressionStack.length > 0) {
        return [
            "<keyword> let </keyword>",
            "<" + `${varName.tag}> ${varName.content} </${varName.tag}>`,
            `<symbol> ${lefthandExpressionStack[0]} </symbol>`,
            ...compileExpression(lefthandExpressionStack.slice(1, lefthandExpressionStack.length - 1)),
            `<symbol> ${lefthandExpressionStack[lefthandExpressionStack.length - 1]} </symbol>`,
            `<symbol> = </symbol>`,
            ...compileExpression(rest.slice(index))
        ]
    }

    return [
        "<letStatement>",
        "<keyword> let </keyword>",
        "<" + `${varName.tag}> ${varName.content} </${varName.tag}>`,
        '<symbol> = </symbol>',
        ...compileExpression(rest.slice(index)),
        "</letStatement>"
    ]

}
function compileWhile(statements) {

}
function compileReturn(statements) {

}

function compileIf(statements) {

}
function compliledo(stament) {

}
function compileExpression(expression) {
    const termsOpStack = []
    let seperator
    if (expression[expression.length - 1].content === ";") {
        seperator = "<symbol> ; </symbol>"
        expression.pop()
    }
    // x= 1 + 2 + 3 + 4... term (op term)*
    for (const term of expression) {
        if (termsOpStack.length === 0
            || operators.includes(termsOpStack[termsOpStack.length - 1])) {
            termsOpStack.push([term])
            continue
        }
        if (operators.includes(term)) {
            termsOpStack.push(term)
            continue
        }
        termsOpStack[termsOpStack.length - 1].push(term)
    }

    const compiledterms = termsOpStack.map(item => {
        if (Array.isArray(item)) {
            return compileTerm(item)
        }
        return item
    })
    return [
        '<expression>',
        ...compiledterms,
        '</expression>',
        `${seperator}`
    ].filter(Boolean)
}
function compileTerm(term) {
    if (term.length === 0) {
        return ""
    }
    if (term.length === 1) {
        // integerConstant | stringConstant | keywordConstant | varName 
        return `<term>\n${singleItemXmlTag(term[0])}\n</term>`
    }
    if (term.length === 2) {
        const [unaryOp, toDoterm] = term
        //unaryOp term
        return `<term>\n${singleItemXmlTag(unaryOp)}\n ${compileTerm([toDoterm])}\n</term>`
    }
    if (term[1].content === "[" && term[term.length - 1].content === "]") {
        // varName '[' expression ']' 
        return `<term>\n${singleItemXmlTag(term[0])}\n${singleItemXmlTag(term[1])}\n ${compileExpression(term.slice(2, term.length - 1).join("\n"))} </term>`
    }
    if (term[0].content === "(" && term[term.length - 1].content === ")") {
        // '(' expression ')'
        return `<term>\n${compileExpression(term.slice(1, term.length - 1)).join("\n")}\n</term>`
    }
    return `<term>\n${subCallTerm(term).join("\n")}</term>`
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
    const expressionList = term.slice(leftIndex + 1, rightIndex)
    const compiledExpressionList = expressionList.map(compileExpression)
    const leftPart = term.slice(0, leftIndex + 1).map(singleItemXmlTag)
    const rightPart = term.slice(rightIndex).map(singleItemXmlTag)
    return [...leftPart, "<expressionList>", ...compiledExpressionList, "</expressionList>", ...rightPart]
}

// main('./compiler/tests/ExpressionLessSquare/Square.jack')
// main('./compiler/tests/ExpressionLessSquare/Main.jack')
// main('./compiler/tests/ArrayTest/main.jack')
//      let game = SquareGame.new();

compileLet([
    { content: 'let', tag: 'keyword' },
    { content: 'a', tag: 'identifier' },
    { content: '[', tag: 'symbol' },
    { content: '1', tag: 'integerConstant' },
    { content: ']', tag: 'symbol' },

    { content: '=', tag: 'symbol' },
    { content: 'a', tag: 'identifier' },
    { content: '[', tag: 'symbol' },
    { content: '2', tag: 'integerConstant' },
    { content: ']', tag: 'symbol' },

    // { content: 'SquareGame', tag: 'identifier' },
    // { content: '.', tag: 'symbol' },
    // { content: 'new', tag: 'identifier' },
    // { content: '(', tag: 'symbol' },
    // { content: ')', tag: 'symbol' },
    // { content: "string constant", tag: "stringConstant" },
    { content: ';', tag: 'symbol' },
])
