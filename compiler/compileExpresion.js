const { singleItemXmlTag } = require("./CompilationEngine")
const compilerDirectMap = require("./static/compilerHeadKeywords.json")
const { classVarDecKeyWord, functionTitles, statementsTitles, operators, statementsNeedNested } = compilerDirectMap;
const { flatten } = require('./utils')
const a = [
    {
        content: "(",
        tag: "symbol",
    },
    {
        content: "(",
        tag: "symbol",
    },
    {
        content: "y",
        tag: "identifier",
    },
    {
        content: "+",
        tag: "symbol",
    },
    {
        content: "size",
        tag: "identifier",
    },
    {
        content: ")",
        tag: "symbol",
    },
    {
        content: "&lt;",
        tag: "symbol",
    },
    {
        content: "254",
        tag: "integerConstant",
    },
    {
        content: ")",
        tag: "symbol",
    },
    {
        content: "&amp;",
        tag: "symbol",
    },
    {
        content: "(",
        tag: "symbol",
    },
    {
        content: "(",
        tag: "symbol",
    },
    {
        content: "x",
        tag: "identifier",
    },
    {
        content: "+",
        tag: "symbol",
    },
    {
        content: "size",
        tag: "identifier",
    },
    {
        content: ")",
        tag: "symbol",
    },
    {
        content: "&lt;",
        tag: "symbol",
    },
    {
        content: "510",
        tag: "integerConstant",
    },
    {
        content: ")",
        tag: "symbol",
    },
]

const b = [
    { "content": "size", "tag": "identifier" },
    { "content": "&gt;", "tag": "symbol" },
    { "content": "2", "tag": "integerConstant" },
]
const c = [
    { "content": "(", "tag": "symbol" },
    { "content": "y", "tag": "identifier" },
    { "content": "+", "tag": "symbol" },
    { "content": "size", "tag": "identifier" },
    { "content": ")", "tag": "symbol" },
    { "content": "&lt;", "tag": "symbol" },
    { "content": "254", "tag": "integerConstant" },
]
function compileExpression(list) {
    if (!Array.isArray(list) && list) {
        return `<expression>\n${compileTerm([list])}\n</expression>`
    }
    const router = {
        first: [],
        op: null,
        second: []
    }
    let lastSperator;
    if(list[list.length - 1].content === ";"){
        lastSperator=list.pop()
    }

    const stack = []
    let tempStack = []
    const isexpressions = [...operators, "("]
    list.forEach((item, index) => {
        const { content } = item
        const lastItem = list[index - 1] 
        const isExpressBrace = !lastItem || isexpressions.includes(lastItem.content)
        if (content === "(") {
            if(isExpressBrace){
                stack.push(item)
            }else{
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
            if(stack.length === 0){
                tempStack.push(item)
                return
            }
            const la = stack.pop()
            let whickOp = router.op ? 'second' : 'first'
            if (router[whickOp].length === 0) {
                router[whickOp].push([la, ...tempStack, item])
            } else {
                router[whickOp] = [la, ...router[whickOp], ...tempStack, item]
            }
            tempStack = []
        }
    })
    if(router.op && router.second.length === 0){
        router.second = router.second.concat(...tempStack)
    }
    if(!router.op && router.first.length === 0){
        router.first = router.first.concat(...tempStack)
    }
    const { first, op, second } = router
    const flatFirst = flatten(first)
    const leftTerm = compileTerm(flatFirst)
    if (op) {
        const rightTerm = compileTerm(flatten(second))
        const ret = flatten([
            '<expression>',
            leftTerm,
            singleItemXmlTag(op),
            rightTerm,
            '</expression>'
        ])
        return ret
    }

    return [
        '<expression>',
        ...leftTerm,
        '</expression>'
    ]
}
function compileTerm(term) {
    const [first, ...rest] = term

    if (first.content === "(" && rest[rest.length - 1].content === ")") {
        const expression = term.slice(1, term.length - 1)
        const compiledExpr = compileExpression(expression)
        return [
            '<term>',
            ' <symbol> ( </symbol>',
            ...compiledExpr,
            ' <symbol> ) </symbol>',
            '</term>'
        ]
    }
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
        return `<term>\n${singleItemXmlTag(term[0])}\n${singleItemXmlTag(term[1])}\n ${compileExpression(term.slice(2, term.length - 1)).join("\n")}\n${singleItemXmlTag(term[term.length - 1])}\n</term>`
    }
    return `<term>\n${subCallTerm(term).join("\n")}\n</term>`

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
        if(content === ","){
            toCompliledExpress.push(expressionList.slice(startpoint, index))
            startpoint = index + 1
        }
    });
    toCompliledExpress.push(expressionList.slice(startpoint))
    
    const compiledExpressionList = flatten(toCompliledExpress.map((item, index)=>{
        return [...compileExpression(item), ' <symbol> , </symbol>']
    }))

    compiledExpressionList.pop()
    const leftPart = term.slice(0, leftIndex + 1).map(singleItemXmlTag)
    const rightPart = term.slice(rightIndex).map(singleItemXmlTag)
  
    return [...leftPart, "<expressionList>", ...compiledExpressionList, "</expressionList>", ...flatten(rightPart)]
}

module.exports = {
    compileTerm,
    compileExpression
}
