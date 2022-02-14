"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const local_api_1 = require("local-api");
//t - running on local dev environment, f - running on user machine
const isProduction = process.env.NODE_ENV === 'production';
exports.serveCommand = new commander_1.Command()
    .command('serve [filename]') //[] - indicate optional value
    .description('Open a file for editting')
    .option('-p --port <number>', 'port to run server on', '4005') //<> - indicate required value
    .action((filename = 'notebook.js', options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Successfully spin-up server...
        const dir = path_1.default.join(process.cwd(), path_1.default.dirname(filename)); //joins curPath + relativePath
        yield (0, local_api_1.serve)(parseInt(options.port), path_1.default.basename(filename), dir, !isProduction);
        console.log(`Opened ${filename}. Navigate to http://localhost:${options.port}`);
    }
    catch (err) {
        if (err.code === 'EADDRINUSE') {
            console.log('Port is in use. Try running on another port.');
        }
        else {
            console.log('Server Error : ', err.message);
        }
        process.exit(1);
    }
}));
