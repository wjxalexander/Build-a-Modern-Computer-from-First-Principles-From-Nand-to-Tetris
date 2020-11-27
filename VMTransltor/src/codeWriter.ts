const fs = require('fs')
import { IPushPop } from "./main";
import { pushPop } from "./memoryAccess"

export function writePushPop(props: IPushPop, file: string) {
    const { command, segment, value } = props
    return pushPop[command](segment, value, file)
}
export function writeFile(streams: string[]) {
    const fileSrtream = fs.createWriteStream(`${outputFileName}.asm`, 'utf-8');
    fileSrtream.on('error', function (err) { console.log(err) });
    streams.forEach((v) => fileSrtream.write(v + '\n'));
    fileSrtream.end()
}