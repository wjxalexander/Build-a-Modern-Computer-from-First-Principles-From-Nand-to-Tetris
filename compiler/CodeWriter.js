const fs = require('fs')


function writeFile(streams, filepath, fileName, fileFormat) {
    const fileSrtream = fs.createWriteStream(`${filepath}/${fileName}.${fileFormat}`, 'utf-8');
    fileSrtream.on('error', function (err) {
        console.log(err)
    });
    
    streams.forEach((v) => fileSrtream.write(v + '\n'));
    fileSrtream.end()
}

module.exports = {
    writeFile
}