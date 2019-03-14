const stripAnsi = require('strip-ansi');
const Util = require('../util');
const template = require('../templates/status');

async function status(args) {
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
        const displayName = line.substring(3);
        let name = displayName;
        const spl = name.split(' -> ');
        if (spl.length === 2) {
            name = spl[1];
        }

        const file = {
            displayName,
            name
        };

        if (x === '#' && y === '#') {
            git.currentBranch = name;
            return;
        }

        if (x === '?' && y === '?') {
            file.type = '?';
            git.files.untracked.push(file);
            return;
        }

        if (x !== ' ') {
            file.type = x;
            git.files.staged.push(file);
        }

        if (y !== ' ') {
            file.type = y;
            git.files.unstaged.push(file);
        }
    });

    const out = template(git);

    Util.saveMap(git.fileMap);

    return out;
}

module.exports = status;