const { tokenizer } = require("./Tokenizer")
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
    return `<class>
  <keyword> ${clsKey} </keyword>
  <identifier> ${clsName} </identifier>
  <symbol> { </symbol>
  ${complileClassBody(rest)}
  <symbol> } </symbol>
</class>`
}

function complileClassBody(classBody){

    console.log(classBody)
}

main('./compiler/tests/ExpressionLessSquare/Main.jack')