const {Util, GitUtil} = require('../gitUtil');

async function amend(args) {
    return await GitUtil.git(['commit', '--amend', '--no-edit', ...Util.replaceArgs(args)]);
}

module.exports = amend;