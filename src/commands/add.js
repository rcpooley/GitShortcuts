const Util = require('../util');
const status = require('./status');

async function add(args) {
    await Util.multiCommand(args, (args, file) => {
        console.log(`# Adding '${file.name}'`);
        return Util.git(['add', ...args, file.name]);
    });

    return await status([]);
}

module.exports = add;