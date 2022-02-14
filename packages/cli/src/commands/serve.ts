import path from 'path';
import { Command } from 'commander';
import { serve } from '@jsxnote/local-api';

//t - running on local dev environment, f - running on user machine
const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
    .command('serve [filename]') //[] - indicate optional value
    .description('Open a file for editting')
    .option('-p --port <number>', 'port to run server on', '4005') //<> - indicate required value
    .action(async (filename = 'notebook.js', options: { port: string }) => {
        try {
            //Successfully spin-up server...
            const dir = path.join(process.cwd(), path.dirname(filename)); //joins curPath + relativePath
            await serve(
                parseInt(options.port),
                path.basename(filename),
                dir,
                !isProduction
            );
            console.log(
                `Opened ${filename}. Navigate to http://localhost:${options.port}`
            );
        } catch (err: any) {
            if (err.code === 'EADDRINUSE') {
                console.log('Port is in use. Try running on another port.');
            } else {
                console.log('Server Error : ', err.message);
            }
            process.exit(1);
        }
    });
