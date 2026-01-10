import { exec, ExecOptions } from 'child_process';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as readline from 'readline';

const TMP_FILE = path.join(os.tmpdir(), 'gitshortcuts.json');

export interface FileEntry {
    type: string;
    name: string;
    data: any;
}

export interface EntryMap {
    [key: string]: FileEntry;
}

export interface ParsedArgs {
    args: string[];
    entries: FileEntry[];
}

export class Util {
    static cmd(
        base: string,
        cmd: string | string[],
        opts?: ExecOptions
    ): Promise<string> {
        if (Array.isArray(cmd)) {
            cmd = cmd.join(' ');
        }
        return new Promise((resolve, reject) => {
            // @ts-ignore
            exec(`${base} ${cmd}`, opts, (error, stdout, stderr) => {
                const stderrStr =
                    typeof stderr === 'string' ? stderr : stderr.toString();
                if (error) {
                    reject(stderrStr.trim() || error.message);
                    return;
                }

                const stdoutStr =
                    typeof stdout === 'string' ? stdout : stdout.toString();
                // For git commands, success output often comes in stderr (like push status)
                // So we combine them if successful
                resolve((stdoutStr + '\n' + stderrStr).trim() + '\n');
            });
        });
    }

    static isInteger(str: string): boolean {
        const num = Number(str);
        return !isNaN(num) && num % 1 === 0 && str.trim() !== '';
    }

    static saveMap(obj: EntryMap): void {
        fs.writeFileSync(TMP_FILE, JSON.stringify(obj));
    }

    static loadMap(): EntryMap {
        if (!fs.existsSync(TMP_FILE)) {
            return {};
        }

        try {
            return JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
        } catch (e) {
            return {};
        }
    }

    static replaceArgs(args: string[]): string[] {
        const map = Util.loadMap();

        const getEntry = (num: string): string => {
            if (!(num in map)) {
                throw `Could not find entry corresponding to [${num}]`;
            }
            return map[num].name;
        };

        const outArgs: string[] = [];

        args.forEach((arg) => {
            const spl = arg.split('-');
            if (arg.startsWith('-')) {
                outArgs.push(arg);
            } else if (Util.isInteger(arg)) {
                outArgs.push(getEntry(arg));
            } else if (
                spl.length === 2 &&
                Util.isInteger(spl[0]) &&
                Util.isInteger(spl[1])
            ) {
                for (let j = parseInt(spl[0]); j <= parseInt(spl[1]); j++) {
                    outArgs.push(getEntry(j.toString()));
                }
            } else {
                outArgs.push(arg);
            }
        });

        return outArgs;
    }

    static parseArgs(args: string[]): ParsedArgs {
        const outArgs: string[] = [];
        const entries: FileEntry[] = [];

        const map = Util.loadMap();

        const addEntry = (num: string) => {
            if (!(num in map)) {
                throw `Could not find entry corresponding to [${num}]`;
            }
            entries.push(map[num]);
        };

        args.forEach((arg) => {
            const spl = arg.split('-');

            if (Util.isInteger(arg)) {
                addEntry(arg);
            } else if (
                spl.length === 2 &&
                Util.isInteger(spl[0]) &&
                Util.isInteger(spl[1])
            ) {
                for (let j = parseInt(spl[0]); j <= parseInt(spl[1]); j++) {
                    addEntry(j.toString());
                }
            } else {
                outArgs.push(arg);
            }
        });

        return {
            args: outArgs,
            entries,
        };
    }

    static async multiCommand(
        args: string[],
        executor: (args: string[], file: FileEntry) => Promise<string>
    ): Promise<void> {
        const parsed = Util.parseArgs(args);

        for (let i = 0; i < parsed.entries.length; i++) {
            let out: string;
            try {
                out = await executor(parsed.args, parsed.entries[i]);
            } catch (e: any) {
                out = e.toString();
            }
            if (out && out.length > 0) {
                console.log(Util.formatOutput(out));
            }
        }
    }

    static formatOutput(out: string): string {
        const lines = out.split('\n').map((line) => `#     ${line.trim()}`);
        return lines.join('\n');
    }

    static input(prompt: string): Promise<string> {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            rl.question(prompt, (answer) => {
                rl.close();

                resolve(answer);
            });
        });
    }

    static renderTemplate<T>(
        template: (
            getNumber: (name: string, data: T) => number,
            data: any
        ) => string,
        type: string,
        data: any
    ): string {
        const map: EntryMap = {};
        let nextNumber = 1;

        const getNumber = (name: string, data: T): number => {
            const num = nextNumber++;
            map[num] = {
                type,
                name,
                data,
            };
            return num;
        };

        const out = template(getNumber, data);

        Util.saveMap(map);

        return out;
    }
}
