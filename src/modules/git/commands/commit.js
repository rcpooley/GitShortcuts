const {Util, GitUtil} = require('../gitUtil');

async function commit(args) {
    const message = await Util.input('Commit message: ');

    return await GitUtil.git(['commit', ...Util.replaceArgs(args), '-m', `"${message}"`]);
}

module.exports = commit;