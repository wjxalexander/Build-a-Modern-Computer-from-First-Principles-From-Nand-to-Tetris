const lexicalElements = require("./static/lexicalElements.json")
const { preload } = require("./PreReader")
const { writeFile } = require('./CodeWriter');

const { keyword, symbol } = lexicalElements

// handle string "xxxx = True, "xxxxx" = true, "xxxxx" = false;

function tokenizer(filepath) {
    const preloadCodes = preload(filepath)

    const grouptedTokens = preloadCodes.map(codeHandler).reduce((acc, cur) => acc.concat(cur))
    const tokensWithTag = grouptedTokens.map(getTokenType)
    const xmlPart = tokensWithTag.map(item => item.xml)
    const jsonPart = tokensWithTag.map(item => item.json)
    const tokensWithLabel = ["<tokens>", ...xmlPart, "</tokens>"]

    const fileArr = filepath.split('/')
    const fileName = fileArr[fileArr.length - 1].split('.')[0]
    fileArr.pop()

    writeFile(tokensWithLabel, fileArr.join("/"), `${fileName}T_my`, "xml")
    return jsonPart
}

function codeHandler(code, index) {
    let lastToken = "";
    let currentToken = ""
    let ret = []
    for (const i of code) {
        if (i !== " ") {
            currentToken += i
            if (isLegalToken(currentToken)) {
                lastToken = currentToken
            } else {
                lastToken && ret.push(lastToken)
                lastToken = i
                currentToken = i
            }
        } else {
            if (!stringTest(currentToken)) {
                lastToken && ret.push(lastToken)
                lastToken = ""
                currentToken = ""
            } else {
                // string contant with space 
                currentToken += i
            }
        }
    }
    ret.push(lastToken)
    return ret
}

function stringTest(token) {
    return /^\".*/.test(token) && token[token.length - 1] !== '"' && !/^\".*\"\S+$/.test(token)
}
function numberTest(token) {
    // negative number are not integer
    if (!Number.isNaN(Number(token)) && Number(token) >= 0) {
        return true
    }
    return false
}
function isLegalToken(token) {
    if (stringTest(token)) {
        return true
    }

    return keyword.includes(token) || symbol.includes(token) || /^\".*\"$/.test(token) || numberTest(token) || /^[a-zA-Z_]\w*$/.test(token)
}

function getTokenType(token) {
    if (keyword.includes(token)) {
        return keywordAndSymbolTokenGenerate(token, "keyword");
    }
    if (symbol.includes(token)) {
        return keywordAndSymbolTokenGenerate(token, "symbol");
    }
    if (/\d+/.test(token)) {
        return integerTokenGenerater(token)
    }
    if (/^\".*\"$/.test(token)) {
        return stringTokenGenerater(token)
    }
    return identifierTokenGenrater(token)
}
const specialSymbolMap = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "&": "&amp;"
}

function keywordAndSymbolTokenGenerate(keyword, symbol) {

    if (specialSymbolMap.hasOwnProperty(keyword)) {
        keyword = specialSymbolMap[keyword]
    }
    return {
        xml: "<" + `${symbol}> ${keyword} </${symbol}>`,
        json: { content: keyword, tag: symbol }
    }
}

function integerTokenGenerater(number) {
    return {
        xml: `<integerConstant> ${number} </integerConstant>`,
        json: { content: number, tag: "integerConstant" }
    }
}

function stringTokenGenerater(string) {
    const stringCotent = string.substring(1, string.length - 1)
    return {
        xml: `<stringConstant> ${stringCotent} </stringConstant>`,
        json: { content: stringCotent, tag: "stringConstant" }
    }
}
function identifierTokenGenrater(identifier) {
    return {
        xml: `<identifier> ${identifier} </identifier>`,
        json: { content: identifier, tag: "identifier" }
    }

}

module.exports = {
    tokenizer
}
// tokenizer('./compiler/tests/ExpressionLessSquare/Main.jack')
// tokenizer('./compiler/tests/ExpressionLessSquare/SquareGame.jack')
// tokenizer('./compiler/tests/ExpressionLessSquare/Square.jack')
