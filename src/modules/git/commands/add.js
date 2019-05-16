const {Util, GitUtil} = require('../gitUtil');
const status = require('./status');

async function add(args) {
    await Util.multiCommand(args, (args, file) => {
        console.log(`# Adding '${file.name}'`);
        return GitUtil.git(['add', ...args, file.name]);
    });

    return await status([]);
}

module.exports = add;