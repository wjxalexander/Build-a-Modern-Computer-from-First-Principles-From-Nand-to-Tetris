import * as fs from "fs";
import * as path from "path"
import parser from "./tools/parser"
import { pushPop } from "./tools/memoryAccess"
import { arithmetic } from "./tools/arithmetic"
type arithmetic = { command: string };
type pushPop = {
    command: string;
    segment: string | null;
    value: string | null;
}
async function main(filepaths: string[]) {
    let Totalret = ""
    filepaths.forEach(async (filepath) => {
        const VMpath = path.join(__dirname, "../08/", `${filepath}.vm`)
        const parsedCommands = await parser(VMpath)
        if (parsedCommands) {
            const oneFileRet = parsedCommands.map((item) => {
                if (item) {
                    const { command } = item
                    if (pushPop[command]) {
                        return writePushPop(item)
                    }
                    if (arithmetic[command]) {
                        return arithmetic[command]()
                    }
                }
            })
            Totalret += oneFileRet
        }

    })
    console.log(Totalret)
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
main(["StackArithmetic/StackTest/StackTest"])