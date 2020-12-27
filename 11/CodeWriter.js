const path = require('path')
const fs = require('fs')


function writeFile(streams, filepath, fileName) {
    console.log(filepath, fileName)
    const fileSrtream = fs.createWriteStream(`${filepath}/${fileName}.vm`, 'utf-8');
    fileSrtream.on('error', function (err) {
        console.log(err)
    });
    streams.forEach((v) => fileSrtream.write(v + '\n'));
    fileSrtream.end()
}

module.exports = {
    writeFile
}