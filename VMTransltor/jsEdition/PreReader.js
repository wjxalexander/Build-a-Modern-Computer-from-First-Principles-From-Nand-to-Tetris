#!/usr/bin/env ts-node-script
const fs = require('fs');
const PromiseFs = fs.promises

async function readFile(dirpath) {
    try {
        const codes = await PromiseFs.readFile(dirpath, 'utf-8')
        return codes.toString()
    } catch (error) {
        console.warn(error)
    }
}
function ignoreWhiteSpace(item) {
    const slashPosition = item.indexOf("//")
    if (slashPosition === 0) {
        return ""
    }
    if (slashPosition > 0) {
        return item.substring(0, slashPosition).trim()
    }
    return item.trim()
}

async function transformString(sourceFile) {
    const loadedCodes = await readFile(sourceFile)
    if (!loadedCodes || loadedCodes.length === 0) {
        return
    }
    return loadedCodes.split("\n").map(ignoreWhiteSpace).filter(item => item.length > 0)
}


module.exports = { preload: transformString } 