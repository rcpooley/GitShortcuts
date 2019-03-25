const Util = require('../util');

module.exports = (args) => Util.git(['checkout', ...Util.replaceArgs(args)]);