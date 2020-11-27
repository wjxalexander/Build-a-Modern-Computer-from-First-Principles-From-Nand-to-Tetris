function writePushPop(props, file) {
    const { command, segment, value } = props
    return pushPop[command](segment, value, file)
}
function writeFile(streams) {
    const fileSrtream = fs.createWriteStream(`${outputFileName}.asm`, 'utf-8');
    fileSrtream.on('error', function (err) { console.log(err) });
    streams.forEach((v) => fileSrtream.write(v + '\n'));
    fileSrtream.end()
}