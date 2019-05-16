const Util = require('../util');

async function commit(args) {
    const newArgs = Util.replaceArgs(args);

    newArgs.unshift('commit');

    const msg = await Util.input('Commit message: ');

    newArgs.push('-m', `"${msg}"`);

    console.log(`# hg ${newArgs.join(' ')}`);

    return await Util.hg(newArgs);
}

module.exports = commit;