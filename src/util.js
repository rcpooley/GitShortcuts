const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const TMP_FILE = path.join(os.tmpdir(), 'gitshortcuts.json');

class Util {
    static git(cmd) {
        if (Array.isArray(cmd)) {
            cmd = cmd.join(' ');
        }
        return new Promise((resolve, reject) => {
            exec(`git -c color.ui=always ${cmd}`, (error, stdout, stderr) => {
                if (error) {
                    if (!error.message.toLowerCase().startsWith('command failed')) {
                        reject(error);
                        return;
                    }
                }

                if (stderr.length > 0) {
                    reject(stderr.trim());
                    return;
                }

                resolve(stdout);
            });
        });
    }

    static isInteger(str) {
        return !isNaN(str) && str % 1 === 0;
    }

    static saveMap(obj) {
        fs.writeFileSync(TMP_FILE, JSON.stringify(obj));
    }

    static loadMap() {
        if (!fs.existsSync(TMP_FILE)) {
            return {};
        }

        try {
            return JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
        } catch (e) {
            return {};
        }
    }

    static replaceArgs(args) {
        const map = Util.loadMap();

        for (let i = 0; i < args.length; i++) {
            if (Util.isInteger(args[i]) && args[i] in map) {
                args[i] = map[args[i]].name;
            }
        }

        return args;
    }

    static parseRangeArgs(args) {
        const map = Util.loadMap();

        const files = [];

        const addFile = (num) => {
            if (!(num in map)) {
                throw `Could not find file corresponding to [${num}]`;
            }
            files.unshift(map[num]);
        };

        const outArgs = args.slice();

        while (outArgs.length > 0) {
            const arg = outArgs[outArgs.length - 1];
            const spl = arg.split('-');

            if (Util.isInteger(arg)) {
                addFile(arg);
            } else if (spl.length === 2 && Util.isInteger(spl[0]) && Util.isInteger(spl[1])) {
                for (let j = parseInt(spl[1]); j >= parseInt(spl[0]); j--) {
                    addFile(j);
                }
            } else {
                break;
            }

            outArgs.splice(outArgs.length - 1, 1);
        }

        return {
            args: outArgs,
            files
        };
    }

    static async multiCommand(args, executor) {
        const parsed = Util.parseRangeArgs(args);

        for (let i = 0; i < parsed.files.length; i++) {
            let out;
            try {
                out = await executor(parsed.args, parsed.files[i]);
            } catch (e) {
                out = e.toString();
            }
            if (out && out.length > 0) {
                const lines = out.split('\n').map(line => `#     ${line.trim()}`);
                console.log(lines.join('\n'));
            }
        }
    }

    static async getGitRoot() {
        const out = await Util.git('rev-parse --show-toplevel');
        return out.trim();
    }
}

module.exports = Util;