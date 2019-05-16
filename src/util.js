const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const readline = require('readline');

const TMP_FILE = path.join(os.tmpdir(), 'gitshortcuts.json');

class Util {
    static hg(cmd) {
        return Util.cmd('hg --color always', cmd);
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

        const getEntry = (num) => {
            if (!(num in map)) {
                throw `Could not find entry corresponding to [${num}]`;
            }
            return map[num].name;
        };

        const outArgs = [];

        args.forEach(arg => {
            const spl = arg.split('-');
            if (arg.startsWith('-')) {
                outArgs.push(arg);
            } else if (Util.isInteger(arg)) {
                outArgs.push(getEntry(arg));
            } else if (spl.length === 2 && Util.isInteger(spl[0]) && Util.isInteger(spl[1])) {
                for (let j = parseInt(spl[0]); j <= parseInt(spl[1]); j++) {
                    outArgs.push(getEntry(j));
                }
            } else {
                outArgs.push(arg);
            }
        });

        return outArgs;
    }

    static parseArgs(args) {
        const outArgs = [];
        const entries = [];

        const map = Util.loadMap();

        const addEntry = (num) => {
            if (!(num in map)) {
                throw `Could not find entry corresponding to [${num}]`;
            }
            entries.push(map[num]);
        };

        args.forEach(arg => {
            const spl = arg.split('-');

            if (Util.isInteger(arg)) {
                addEntry(arg);
            } else if (spl.length === 2 && Util.isInteger(spl[0]) && Util.isInteger(spl[1])) {
                for (let j = parseInt(spl[0]); j <= parseInt(spl[1]); j++) {
                    addEntry(j);
                }
            } else {
                outArgs.push(arg);
            }
        });

        return {
            args: outArgs,
            entries
        };
    }

    static async multiCommand(args, executor) {
        const parsed = Util.parseArgs(args);

        for (let i = 0; i < parsed.entries.length; i++) {
            let out;
            try {
                out = await executor(parsed.args, parsed.entries[i]);
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

    static renderTemplate(template, type, data) {
        const map = {};
        let nextNumber = 1;

        const getNumber = (name, data) => {
            const num = nextNumber++;
            map[num] = {
                type,
                name,
                data
            };
            return num;
        };

        const out = template(getNumber, data);

        Util.saveMap(map);

        return out;
    }
}

module.exports = Util;