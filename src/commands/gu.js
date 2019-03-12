const Util = require('../util');
const gs = require('./gs');

async function gu(args) {
    const filesToUnstage = Util.parseRangeArgs(args);

    for (let i = 0; i < filesToUnstage.length; i++) {
        const file = filesToUnstage[i];
        console.log(`# Unstaging '${file.name}'`);

        const cmd = file.type === 'A' ? 'rm --cached' : 'reset HEAD';

        await Util.git(`${cmd} ${file.name}`);
    }

    if (filesToUnstage.length > 0) {
        console.log('#');
    }

    return await gs([]);
}

module.exports = gu;