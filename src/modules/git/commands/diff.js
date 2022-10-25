const { Util, GitUtil } = require('../gitUtil');

async function add(args) {
    await Util.multiCommand(args, (args, file) => {
        return GitUtil.git(['diff', ...args, file.name]);
    });
    return '';
}

module.exports = add;
