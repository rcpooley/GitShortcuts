const stripAnsi = require('strip-ansi');
const Util = require('../util');
const template = require('../templates/branch');

async function gb(args) {
    args.unshift('branch');

    const rawOut = await Util.git(args);
    const colorlessOut = stripAnsi(rawOut);

    const lines = colorlessOut.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const git = {
        currentBranch: null,
        branches: [],
        branchMap: {},
        nextNumber: 1,
        getNumber: (branch) => {
            const num = git.nextNumber++;
            git.branchMap[num] = {type: 'branch', name: branch};
            return num;
        }
    };

    let valid = true;

    lines.forEach(line => {
        const spl = line.split(' ').filter(s => s.length > 0);
        const active = spl[0] === '*';
        if (active) {
            spl.splice(0, 1);
            git.currentBranch = spl[0];
        }
        git.branches.push(spl[0]);
        if (spl.length > 1) {
            valid = false;
        }
    });

    // Return raw output if the output isn't what we expected
    if (git.currentBranch === null || !valid) {
        return rawOut;
    }

    const out = template(git);

    Util.saveMap(git.branchMap);

    return out;
}

module.exports = gb;