const Util = require('../util');

async function log(args) {
    if (args.length > 0) {
        args.unshift('ssl');
        return await Util.hg(args);
    }

    const out = await Util.hg('ssl');
    const lines = out.split('\n');

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let indent = 0;
        while (true) {
            if (line.startsWith('o') || line.startsWith('@')) {
                let idx = 3 + indent * 2;
                lines[i] = lines[i].substring(0, idx) + '[0] ' + lines[i].substring(idx);
            } else if (line.startsWith('| ')) {
                line = line.substring(2);
                indent++;
                continue;
            }
            break;
        }
    }

    return lines.join('\n');
}

module.exports = log;