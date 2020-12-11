const lexicalElements = require("./static/lexicalElements.json")
const { preload } = require("./PreReader")
const { writeFile } = require('./CodeWriter');

const { keyword, symbol } = lexicalElements

// handle string "xxxx = True, "xxxxx" = true, "xxxxx" = false;
function stringTest(token) {
    return /^\".*/.test(token) && token[token.length - 1] !== '"' && !/^\".*\"\S+$/.test(token)
}
function tokenizer(filepath) {
    const preloadCodes = preload(filepath)
    const grouptedTokens = preloadCodes.map(codeHandler).reduce((acc, cur) => acc.concat(cur))
    const tokensWithLabel = ["<tokens>", ...grouptedTokens.map(getTokenType), "</tokens>"]

    const fileArr = filepath.split('/')
    const fileName = fileArr[fileArr.length - 1].split('.')[0]
    fileArr.pop()
    writeFile(tokensWithLabel, fileArr.join("/"), `${fileName}T_my`, "xml")
    console.log(tokensWithLabel)
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

function isLegalToken(token) {
    if (stringTest(token)) {
        return true
    }
    return keyword.includes(token) || symbol.includes(token) || /^\".*\"$/.test(token) || !Number.isNaN(Number(token)) || /^[a-zA-Z_]\w*$/.test(token)
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
    ">": "&lt;",
    '"': "&quot;",
    "&": "&amp;"
}

function keywordAndSymbolTokenGenerate(keyword, symbol) {
    if (specialSymbolMap[keyword]) {
        keyword = specialSymbolMap[keyword]
    }
    return "<" + `${symbol}> ${keyword} </${symbol}>`
}

function integerTokenGenerater(number) {
    return `<integerConstant> ${number} </integerConstant>`
}

function stringTokenGenerater(string) {
    return `<stringConstant> ${string.substring(1, string.length - 1)} </stringConstant>`
}
function identifierTokenGenrater(identifier) {
    return `<identifier> ${identifier} </identifier>`
}
tokenizer('./compiler/tests/ArrayTest/Main.jack')

//'if (x < 153)'
//'{let city="Paris";}'
/*
<tokens>
  <keyword> if </keyword>
  <symbol> ( </symbol>
  <identifier> x </identifier>
  <symbol> &lt; </symbol>
  <integerConstant> 153
  </integerConstant>
  <symbol> ) </symbol>
  <symbol> { </symbol>
  <keyword> let </keyword>
  <identifier> city </identifier>
  <symbol> = </symbol>
  <stringConstant> Paris
  </stringConstant>
  <symbol> ; </symbol>
  <symbol> } </symbol>
</tokens>
*/