const stripAnsi = require('strip-ansi');
const Util = require('../util');
const template = require('../templates/status');

async function gs(args) {
    if (args.length > 0) {
        args.unshift('status');
        return await Util.git(args);
    }

    const lines = stripAnsi(await Util.git('status -s -b'))
        .split('\n')
        .filter(line => line.length > 0);

    const git = {
        currentBranch: '<unknown>',
        files: {
            staged: [],
            unstaged: [],
            untracked: []
        },
        fileMap: {},
        nextNumber: 1,
        getNumber: (file) => {
            const num = git.nextNumber++;
            git.fileMap[num] = file;
            return num;
        }
    };

    // Parse lines
    lines.forEach(line => {
        const x = line.charAt(0);
        const y = line.charAt(1);
        const name = line.substring(3);

        if (x === '#' && y === '#') {
            git.currentBranch = name;
            return;
        }

        if (x === '?' && y === '?') {
            git.files.untracked.push({
                type: '?',
                name
            });
            return;
        }

        if (x !== ' ') {
            git.files.staged.push({
                type: x,
                name
            });
        }

        if (y !== ' ') {
            git.files.unstaged.push({
                type: y,
                name
            });
        }
    });

    const out = template(git);

    Util.saveMap(git.fileMap);

    return out;
}

module.exports = gs;