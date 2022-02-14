import * as esbuild from 'esbuild-wasm';


export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {

            //if esbuild is looking for index.js (root entry point)
                //onResolve uses Regex in a filter to only handle exactly "index.js"
            build.onResolve({filter: /(^index\.js$)/}, () => {
                return { path: 'index.js', namespace: 'a'};
            });

            //if esbuild is looking for a relative path within module (child ./ || parent ../ of current path)
                //onResolve uses Regex in a filter to only handle exactly "index.js"
            build.onResolve({ filter: /^\.+\// }, (args: any) => {
                return {
                    namespace: 'a',
                    path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
                }
            })

            //handle main file of module
            build.onResolve({ filter: /.*/ }, async (args: any) => {

                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`
                }
            });
        }
    }
};