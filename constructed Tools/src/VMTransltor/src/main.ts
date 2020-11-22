import * as fs from "fs";
import * as path from "path"
import parser from "./parser"
import { pushPop } from "./tools/memoryAccess"
import { arithmetic } from "./tools/arithmetic"
type arithmetic = { command: string };
type pushPop = {
    command: string;
    segment: string;
    value: string;
}
async function main(filepath: string) {
    const VMpath = path.join(__dirname, "../07/", `${filepath}.vm`)
    const parsedCommands = await parser(VMpath)
    if (parsedCommands) {
        const ret = parsedCommands.map((item: any) => {
            const { command } = item
            if (pushPop[command]) {
                return writePushPop(item)
            }
            if (arithmetic[command]) {
                return arithmetic[command]()
            }
        })

        console.log(ret)
        const fileSrtream = fs.createWriteStream(path.join(__dirname, "../07", `${filepath}.asm`), 'utf-8');
        fileSrtream.on('error', function (err) { console.log(err) });
        ret.forEach((v) => fileSrtream.write(v + '\n'));
        fileSrtream.end();
    }

    // const fileSrtream = fs.createWriteStream(path.join(__dirname, "../targetcode", `${filepath}.hack`), 'utf-8');
    // fileSrtream.on('error', function (err) { console.log(err) });
    // arr.forEach((v) => fileSrtream.write(v + '\n'));
    // fileSrtream.end();
}
function writePushPop(props: pushPop) {
    const { command, segment, value } = props
    return pushPop[command](segment, value)
}
// main("StackArithmetic/SimpleAdd/SimpleAdd")
main("StackArithmetic/StackTest/StackTest")