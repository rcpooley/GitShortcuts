const Util = require('../../util');
const C = require('../../colors');
const S = require('../../symbols');

class GitUtil {
    static git(cmd) {
        return Util.cmd('git -c color.ui=always', cmd);
    }
}

module.exports = {Util, C, S, GitUtil};