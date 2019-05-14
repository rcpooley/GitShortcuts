const Util = require('../util');
const status = require('./hgStatus');

function hgMulti(cmd, prefix, showStatus=true) {
    return async function (args) {
        await Util.multiCommand(args, (args, file) => {
            console.log(`# ${prefix}'${file.name}'`);
            return Util.hg([cmd, ...args, file.name]);
        });

        if (showStatus) {
            return await status([]);
        }
    };
}

module.exports = hgMulti;