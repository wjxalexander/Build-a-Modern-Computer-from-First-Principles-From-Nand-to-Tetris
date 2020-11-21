import * as fs from "fs";
import * as path from "path"
import parser from "./parser"
async function main(filepath: string) {
    const VMpath = path.join(__dirname, "../07/", `${filepath}.vm`, 'utf-8')
    const parsedCommands = await parser(VMpath)

    console.log(parsedCommands)
    // const fileSrtream = fs.createWriteStream(path.join(__dirname, "../targetcode", `${filepath}.hack`), 'utf-8');
    // fileSrtream.on('error', function (err) { console.log(err) });
    // arr.forEach((v) => fileSrtream.write(v + '\n'));
    // fileSrtream.end();
}

main("StackArithmetic/SimpleAdd/SimpleAdd")