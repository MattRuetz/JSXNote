#!/usr/bin/env NODE

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (
    port: number,
    filename: string,
    dir: string,
    useProxy: boolean
) => {
    const app = express();

    app.use(createCellsRouter(filename, dir)); //first try to match filename

    if (useProxy) {
        //if no match - use Proxy
        app.use(
            createProxyMiddleware({
                target: 'http://localhost:3000',
                ws: true,
                logLevel: 'silent',
            })
        );
    } else {
        const packagePath = require.resolve(
            '@jsxnote/local-client/build/index.html'
        );
        app.use(express.static(path.dirname(packagePath)));
    }

    return new Promise<void>((resolve, reject) => {
        app.listen(port, resolve).on('error', reject);
    });
};
