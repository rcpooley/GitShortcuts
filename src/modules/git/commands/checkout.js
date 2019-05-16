const {Util, GitUtil} = require('../gitUtil');

module.exports = (args) => GitUtil.git(['checkout', ...Util.replaceArgs(args)]);