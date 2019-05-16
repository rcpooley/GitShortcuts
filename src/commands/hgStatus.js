const stripAnsi = require('strip-ansi');
const Util = require('../util');
const template = require('../modules/git/templates/status');

async function status(args) {
    if (args.length > 0) {
        args.unshift('status');
        return await Util.hg(args);
    }

    const lines = stripAnsi(await Util.hg('status'))
        .split('\n')
        .filter(line => line.length > 0);

    const git = {
        hg: true,
        files: {
            staged: [],
            unstaged: [],
            hgChanged: [],
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
        const type = line.charAt(0);
        const displayName = line.substring(2);

        const file = {
            displayName,
            name: displayName,
            type
        };

        if (type === 'M' || type === 'A' || type === 'R' || type === '!') {
            git.files.hgChanged.push(file);
        } else {
            git.files.untracked.push(file);
        }
    });

    const out = template(git);

    Util.saveMap(git.fileMap);

    return out;
}

module.exports = status;
