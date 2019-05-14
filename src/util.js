const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const readline = require('readline');

const TMP_FILE = path.join(os.tmpdir(), 'gitshortcuts.json');

class Util {
    static git(cmd) {
        return Util.cmd('git -c color.ui=always', cmd);
    }

    static hg(cmd) {
        return Util.cmd('hg', cmd);
    }

    static cmd(base, cmd) {
        if (Array.isArray(cmd)) {
            cmd = cmd.join(' ');
        }
        return new Promise((resolve, reject) => {
            exec(`${base} ${cmd}`, (error, stdout, stderr) => {
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

        const getFile = (num) => {
            if (!(num in map)) {
                throw `Could not find file corresponding to [${num}]`;
            }
            return map[num].name;
        };

        const outArgs = [];

        args.forEach(arg => {
            const spl = arg.split('-');
            if (arg.startsWith('-')) {
                outArgs.push(arg);
            } else if (Util.isInteger(arg)) {
                outArgs.push(getFile(arg));
            } else if (spl.length === 2 && Util.isInteger(spl[0]) && Util.isInteger(spl[1])) {
                for (let j = parseInt(spl[0]); j <= parseInt(spl[1]); j++) {
                    outArgs.push(getFile(j));
                }
            } else {
                outArgs.push(arg);
            }
        });

        return outArgs;
    }

    static parseArgs(args) {
        const outArgs = [];
        const files = [];

        const map = Util.loadMap();

        const addFile = (num) => {
            if (!(num in map)) {
                throw `Could not find file corresponding to [${num}]`;
            }
            files.push(map[num]);
        };

        args.forEach(arg => {
            const spl = arg.split('-');

            if (arg.startsWith('-')) {
                outArgs.push(arg);
            } else if (Util.isInteger(arg)) {
                addFile(arg);
            } else if (spl.length === 2 && Util.isInteger(spl[0]) && Util.isInteger(spl[1])) {
                for (let j = parseInt(spl[0]); j <= parseInt(spl[1]); j++) {
                    addFile(j);
                }
            } else {
                files.push({name: arg, type: 'argument'});
            }
        });

        return {
            args: outArgs,
            files,
            names: files.map(file => file.name)
        };
    }

    static async multiCommand(args, executor) {
        const parsed = Util.parseArgs(args);

        for (let i = 0; i < parsed.files.length; i++) {
            let out = '';
            try {
                await executor(parsed.args, parsed.files[i]);
            } catch (e) {
                out = e.toString();
            }
            if (out && out.length > 0) {
                console.log(Util.formatOutput(out));
            }
        }
    }

    static formatOutput(out) {
        const lines = out.split('\n').map(line => `#     ${line.trim()}`);
        return lines.join('\n');
    }

    static async getGitRoot() {
        const out = await Util.git('rev-parse --show-toplevel');
        return out.trim();
    }

    static input(prompt) {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(prompt, (answer) => {
                rl.close();

                resolve(answer);
            });
        })
    }
}

module.exports = Util;