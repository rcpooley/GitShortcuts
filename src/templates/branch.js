const C = require('./colors');

module.exports = function (git) {
    let out = '';

    git.branches.forEach(branch => {
        const num = git.getNumber(branch);
        if (branch === git.currentBranch) {
            out += `* [${num}] ${C.FgGreen}${branch}${C.Reset}\n`;
        } else {
            out += `  [${num}] ${branch}\n`;
        }
    });

    return out;
};