const fs = require('fs');
const path = require('path');
const { parser } = require('./parser');
const { pushPop } = require('./memoryAccess');
const { arithmetic } = require('./arithmetic');

console.log(11233)
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
    outputFileName = preName
    main(inputFileName, preName)
}

async function main(filepath, preName) {
    const parsedCommands = await parser(filepath)
    if (parsedCommands && outputFileName) {
        const ret = parsedCommands.map((item) => {
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
function writePushPop(props, file) {
    const { command, segment, value } = props
    return pushPop[command](segment, value, file)
}
function writeFile(streams) {
    const fileSrtream = fs.createWriteStream(`${outputFileName}.asm`, 'utf-8');
    fileSrtream.on('error', function (err) { console.log(err) });
    streams.forEach((v) => fileSrtream.write(v + '\n'));
    console.log(333)
    fileSrtream.end()
}
// main("StackArithmetic/SimpleAdd/SimpleAdd.vm")
// main("StackArithmetic/StackTest/StackTest.vm")
// main("MemoryAccess/BasicTest/BasicTest.vm")
// main("MemoryAccess/PointerTest/PointerTest.vm")
// main("MemoryAccess/StaticTest/StaticTest.vm")