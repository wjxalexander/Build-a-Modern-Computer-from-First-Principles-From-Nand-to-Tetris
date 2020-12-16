const { singleItemXmlTag } = require("./CompilationEngine")
const compilerDirectMap = require("./static/compilerHeadKeywords.json")
const { classVarDecKeyWord, functionTitles, statementsTitles, operators, statementsNeedNested } = compilerDirectMap;
const { flatten } = require('./utils')