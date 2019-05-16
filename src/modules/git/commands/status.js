const stripAnsi = require('strip-ansi');
const {Util, GitUtil} = require('../gitUtil');
const template = require('../templates/status');

async function status(args) {
    if (args.length > 0) {
        args.unshift('status');
        return await GitUtil.git(args);
    }

    const out = await GitUtil.git('status -s -b');

    const data = parseOutput(out);

    return Util.renderTemplate(template, 'file', data)
}

function parseOutput(rawOut) {
    const lines = stripAnsi(rawOut)
        .split('\n')
        .filter(line => line.length > 0);

    const data = {
        currentBranch: '<unknown>',
        files: {
            staged: [],
            unstaged: [],
            untracked: []
        },
    };

    // Parse lines
    lines.forEach(line => {
        const x = line.charAt(0);
        const y = line.charAt(1);
        const rawName = line.substring(3);

        if (x === '#' && y === '#') {
            data.currentBranch = rawName;
            return;
        }

        let name = rawName;
        const spl = name.split(' -> ');
        if (spl.length === 2) {
            name = spl[1];
        }

        const file = {
            rawName,
            name,
            type: '',
        };

        if (x === '?' && y === '?') {
            data.files.untracked.push({
                ...file,
                type: '?'
            });
            return;
        }

        if (x !== ' ') {
            data.files.staged.push({
                ...file,
                type: x
            });
        }

        if (y !== ' ') {
            data.files.unstaged.push({
                ...file,
                type: y
            });
        }
    });

    return data;
}

module.exports = status;