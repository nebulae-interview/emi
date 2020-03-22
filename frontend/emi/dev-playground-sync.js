const sync = require('sync-directory');
var path = require("path");
var fs = require("fs");
const MFE_SETUP_PATHS = [/*AUTOGEN_MFE_SETUP_PATH*/];

const readMfeSetup = (path, cb) => {
    fs.readFile(require.resolve(path), (err, data) => {
        if (err)
            cb(err)
        else
            cb(null, JSON.parse(data))
    })
}


MFE_SETUP_PATHS.forEach(mfeSetupPath => {
    readMfeSetup(mfeSetupPath, ((error, mfeSetup) => {
        if (error) {
            console.error('sync-directory Err: ', error);
            return;
        }
        mfeSetup.map(({ name, src, assets }) => { return [name, `../../${src}`, `./src/app/main/${path.basename(src)}`, `../../${assets}`, `./public/assets/mfe/${path.basename(assets)}`]; })
            .map(([name, srcDir, srcTargetDir, assets, assetsTargetDir]) => ([[name, srcDir, srcTargetDir], [name, assets, assetsTargetDir]] ))
            .reduce((acc, val) => {
                const [src,asset] = val;
                acc.push(src);
                acc.push(asset);
                return acc;
            }, [])
            .forEach(([name, from, to]) => {
                sync(from, to, {
                    watch: true,
                    onError: (err) => console.error(`sync-directory(${name},${from}) err:`, err),
                    cb({ type, path }) {
                        // type: add / remove / unlink / unlinkDir
                        // path: file path
                        console.log(`sync-directory(${name}) watch:`, type, path)
                    }
                })
            });
    }));
});