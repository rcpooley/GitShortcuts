const {Util, GitUtil} = require('../gitUtil');
const status = require('./status');

async function unstage(args) {
    await Util.multiCommand(args, (args, file) => {
        console.log(`# Unstaging '${file.name}'`);

        const cmd = file.type === 'A' ? 'rm --cached' : 'reset HEAD';

        return GitUtil.git(`${cmd} ${file.name}`);
    });

    return await status([]);
}

module.exports = unstage;