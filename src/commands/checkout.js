const Util = require('../util');

module.exports = (args) => {
    args = Util.replaceArgs(args);

    args.unshift('checkout');

    return Util.git(args);
};