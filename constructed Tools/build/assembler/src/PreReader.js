#!/usr/bin/env ts-node-script
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const PromiseFs = fs.promises;
async function readFile(dirpath) {
    try {
        const codes = await PromiseFs.readFile(path.join(__dirname, '../sourceCode', dirpath), 'utf-8');
        return codes.toString();
    }
    catch (error) {
        console.warn(error);
    }
}
function ignoreWhiteSpace(item) {
    const slashPosition = item.indexOf("//");
    if (slashPosition === 0) {
        return "";
    }
    if (slashPosition > 0) {
        return item.substring(0, slashPosition).trim();
    }
    return item.trim();
}
async function transformString(sourceFile) {
    const loadedCodes = await readFile(sourceFile);
    if (!loadedCodes || loadedCodes.length === 0) {
        return;
    }
    return loadedCodes.split("\n").map(ignoreWhiteSpace).filter(item => item.length > 0);
}
exports.default = transformString;
