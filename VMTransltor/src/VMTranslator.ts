import * as fs from "fs";
import * as path from "path"
import parser from "./parser"
import { pushPop } from "./memoryAccess"
import { arithmetic } from "./arithmetic"
import { } from "./codeWriter"
type arithmetic = { command: string };
type pushPop = {
    command: string;
    segment: string;
    value: string;
}
let outputFileName = ''
const inputFileName = process.argv[2]
const isDirectory = fs.lstatSync(inputFileName).isDirectory()

if (isDirectory) {
    outputFileName = inputFileName
    fs.readdir(inputFileName, (err, files) => {
        if (err) {
            throw err
        }
        files.forEach(file => {
            let tempArry = file.split('.')
            if (tempArry.pop() == 'vm') {
                let preName = tempArry.join('.')
                main(outputFileName, preName)
            }
        })
    })
} else {
    let tempArry = inputFileName.split('.')
    tempArry.pop()
    let preName = tempArry.join('.')
    console.log(preName)
    outputFileName = preName
    main(inputFileName, preName)
}

async function main(filepath: string, preName: string) {
    const parsedCommands = await parser(filepath)
    if (parsedCommands && outputFileName) {
        const ret = parsedCommands.map((item: any) => {
            const { command } = item
            if (pushPop[command]) {
                return writePushPop(item, preName)
            }
            if (arithmetic[command]) {
                return arithmetic[command]()
            }
        })
        writeFile(ret)
    }
}


// main("StackArithmetic/SimpleAdd/SimpleAdd.vm")
// main("StackArithmetic/StackTest/StackTest.vm")
// main("MemoryAccess/BasicTest/BasicTest.vm")
// main("MemoryAccess/PointerTest/PointerTest.vm")
// main("MemoryAccess/StaticTest/StaticTest.vm")