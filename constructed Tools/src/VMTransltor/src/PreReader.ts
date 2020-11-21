#!/usr/bin/env ts-node-script
import * as fs from "fs";
import * as path from "path"
const PromiseFs = fs.promises

async function readFile(dirpath: string) {
    try {
        const codes = await PromiseFs.readFile(path.join(__dirname, '../sourceCode', dirpath), 'utf-8')
        return codes.toString()
    } catch (error) {
        console.warn(error)
    }
}
function ignoreWhiteSpace(item: string) {
    const slashPosition = item.indexOf("//")
    if (slashPosition === 0) {
        return ""
    }
    if (slashPosition > 0) {
        return item.substring(0, slashPosition).trim()
    }
    return item.trim()
}

async function transformString(sourceFile: string) {
    const loadedCodes = await readFile(sourceFile)
    if (!loadedCodes || loadedCodes.length === 0) {
        return
    }
    return loadedCodes.split("\n").map(ignoreWhiteSpace).filter(item => item.length > 0)
}


export default transformString