#!/usr/bin/env ts-node-script
const fs = require('fs');

function readFile(dirpath) {
    try {
        const codes = fs.readFileSync(dirpath, 'utf-8')
        return codes.toString()
    } catch (error) {
        console.warn(error)
    }
}
function ignoreWhiteSpace(item) {
    const doubleSlashPosition = item.indexOf("//")
    const slashStarPosition = item.indexOf("/*")
    const singleStarPosition = item.indexOf(" * ")

    if (doubleSlashPosition === 0 || slashStarPosition === 0 || singleStarPosition === 0 || item.includes("*/")) {
        return ""
    }
    if (doubleSlashPosition > 0) {
        return item.substring(0, doubleSlashPosition).trim()
    }
    if (slashStarPosition > 0) {
        return item.substring(0, slashStarPosition).trim()
    }
    return item.trim()
}

function transformString(sourceFile) {
    const loadedCodes = readFile(sourceFile)
    if (!loadedCodes || loadedCodes.length === 0) {
        return
    }
    return loadedCodes.split("\n").map(ignoreWhiteSpace).filter(item => item.length > 0)
}


module.exports = { preload: transformString } 