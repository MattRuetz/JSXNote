import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
    name: 'filecache'
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {

            build.onLoad({filter: /(^index\.js$)/}, () => {
                return {
                        loader: 'jsx',
                        contents: inputCode,
                    };
            });

            build.onLoad({filter: /.*/}, async (args: any) => {
                //Check if already fetched file and if its IN CACHE
                //if so, return immediately from fileCache
                const cachedResult = await fileCache.getItem < esbuild.OnLoadResult > (args.path);

                if (cachedResult) {
                    return cachedResult;
                }
            });

            // on loading CSS FILES
            build.onLoad({ filter: /.css$/ }, async (args: any) => {
            
                const {
                    data,
                    request
                } = await axios.get(args.path);

                // 'escaped' is a formatted version of CSS files which can be injected between quotes in doc.head
                const escaped = data
                    .replace(/\n/g, '')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'");

                const contents = 
                    `
                    const style = document.createElement('style');
                    style.innerText = '${escaped}';
                    document.head.appendChild(style);
                    `;

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents,
                    resolveDir: new URL('./', request.responseURL).pathname
                };

                //store response in cache
                await fileCache.setItem(args.path, result);
                return result;
            });


            // on loading PLAIN JS FILES
            build.onLoad({filter: /.*/}, async (args: any) => {

                const {
                    data,
                    request
                } = await axios.get(args.path);

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                };

                //store response in cache
                await fileCache.setItem(args.path, result);
                return result;
            });
        },
    };
}