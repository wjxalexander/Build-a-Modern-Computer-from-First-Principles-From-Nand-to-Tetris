const { pushPop } = require('./memoryAccess');
const path = require('path')
const fs = require('fs')

function writePushPop(props, file) {
    const {
        command,
        segment,
        value
    } = props
    return pushPop[command](segment, value, file)
}

function writeFile(streams, filepath,fileName) {
    const fileSrtream = fs.createWriteStream(`${filepath}/${fileName}.asm`, 'utf-8');
    fileSrtream.on('error', function (err) {
        console.log(err)
    });
    streams.forEach((v) => fileSrtream.write(v + '\n'));
    fileSrtream.end()
}

module.exports = {
    writePushPop,
    writeFile
}