const fs = require('fs')
const { main } = require('./main')
const { writeFile } = require('./writeCode');
const filePath = process.argv[2]

const isDirectory = fs.lstatSync(filePath).isDirectory()
let asmCodes = []
let outputFilePath

if (isDirectory) {
    outputFilePath = filePath
    fs.readdir(filePath, (err, files) => {
        if (err) {
            throw err
        }
        //SYS first
        const index = files.indexOf('Sys.vm') 

        const temp = files[0]
        files[0]=files[index]
        files[index]= temp

        files.forEach(file => {
            if (file.split('.').pop() == 'vm') {
                const currentAsmCodes = main(`${filePath}/${file}`)
                asmCodes = asmCodes.concat(currentAsmCodes) 
            } 
        })
        const fileArr = filePath.split('/')
        const fileName = fileArr[fileArr.length - 1]
        writeFile(asmCodes, fileArr.join("/"), fileName)

    })
} else {
    asmCodes = main(filePath)
    const fileArr = filePath.split('/')
    fileArr.pop()
    const fileName = fileArr[fileArr.length - 1]
    writeFile(asmCodes, fileArr.join("/"), fileName)
}
