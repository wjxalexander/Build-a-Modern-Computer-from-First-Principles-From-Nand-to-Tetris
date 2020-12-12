const { tokenizer } = require("./Tokenizer")
const compilerDirectMap = require("./static/compilerHeadKeywords.json")

const { classVarDecKeyWord, functionTitles } = compilerDirectMap;

function main(filePath) {
    const tokenizedCode = tokenizer(filePath)
    compileClass(tokenizedCode)
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
    const {varStack,subroutine} = router
    const classVarDecResult = compileClassVarDec(varStack)
    const subroutineResulte = compileSubroutine(subroutine)
    console.log(router)
}

function compileClassVarDec(varDecs) {
    const tokenizedVars = varDecs.map(item => {
        return [
            `<classVarDec>`,
            ...item.map(({ tag, content }) => "  <" + `${tag}> ${content} </${tag}>`),
            `</classVarDec>`
        ]
    })

    return tokenizedVars
}

function compileSubroutine(routines) {
    // const 
    console.log(routines)
}

main('./compiler/tests/ExpressionLessSquare/Square.jack')
// main('./compiler/tests/ArrayTest/main.jack')