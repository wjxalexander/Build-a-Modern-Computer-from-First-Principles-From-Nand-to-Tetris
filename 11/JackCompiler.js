const fs = require('fs')
const { main } = require('./CompilationEngine')
const { writeFile } = require('./CodeWriter');
const filePath = process.argv[2]

const isDirectory = fs.lstatSync(filePath).isDirectory()
let asmCodes = []
let outputFilePath

if (isDirectory) {
    outputFilePath = filePath
    console.log(filePath)
    fs.readdir(filePath, (err, files) => {
        if (err) {
            throw err
        }
        files.forEach(file => {
            if (file.split('.').pop() == 'jack') {
                const compiledfile = main(`${filePath}/${file}`)
                const fileArr = filePath.split('/')
                const fileName = file.split('.')[0]
                writeFile(compiledfile, fileArr.join("/"), `${fileName}`)
            }
        })
    })
} else {
    const { TFile, compiled } = main(filePath)
    const fileArr = filePath.split('/')
    const fileName = fileArr.pop().split('.')[0]
    writeFile(TFile, fileArr.join("/"), `${fileName}T`)
    writeFile(compiled, fileArr.join("/"), `${fileName}`)
}
