const {C} = require('../gitUtil');

module.exports = function (getNumber, data) {
    const {branches, currentBranch} = data;

    let out = '';

    branches.forEach(branch => {
        const num = getNumber(branch);
        if (branch === currentBranch) {
            out += `* [${num}] ${C.FgGreen}${branch}${C.Reset}\n`;
        } else {
            out += `  [${num}] ${branch}\n`;
        }
    });

    return out;
};