const Util = require('../util');
const status = require('./hgStatus');

function hg(cmd, showStatus=true) {
    return async function (args) {
        const newArgs = Util.replaceArgs(args);

        newArgs.unshift(cmd);

        console.log(`# hg ${newArgs.join(' ')}`);

        const out = await Util.hg(newArgs);

        if (out.length > 0) {
            console.log(Util.formatOutput(out));
        }

        if (showStatus) {
            return await status([]);
        }
    };
}

module.exports = hg;