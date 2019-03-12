const Util = require('../util');
const gs = require('./gs');

async function ga(args) {
    const filesToAdd = Util.parseRangeArgs(args);

    for (let i = 0; i < filesToAdd.length; i++) {
        const file = filesToAdd[i];
        console.log(`# Adding '${file.name}'`);
        try {
            await Util.git(`add ${file.name}`);
        } catch (e) {
            const lines = e.split('\n').map(line => `#     ${line.trim()}`);
            console.log(lines.join('\n'));
        }
    }

    if (filesToAdd.length > 0) {
        console.log('#');
    }

    return await gs([]);
}

module.exports = ga;