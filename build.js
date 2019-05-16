const fs = require('fs');
const path = require('path');
const pkg = require('pkg');
const rimraf = require('rimraf');
const { exec } = require('child_process');
const commands = require('./src/modules/commands');
const config = require('./config.json');

const OUT_DIRECTORY = config.binaryDirectory;

const MAIN_BINARY = config.binaryName;

const SH_SCRIPT = `#!/bin/bash\n${MAIN_BINARY} CMD $@`;

const BATCH_SCRIPT = `@echo off\n${MAIN_BINARY} CMD %*`;

function rimrafProm(dir) {
    return new Promise(resolve => rimraf(dir, resolve));
}

function cmd(cmd, opts) {
    return new Promise((resolve, reject) => {
        exec(cmd, opts, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else if (stderr.length > 0) {
                reject(new Error(stderr));
            } else {
                resolve(stdout);
            }
        });
    });
}

async function createBinary(command) {
    if (process.platform === 'win32') {
        // Create the script
        const scriptFile = `${command}.bat`;
        const scriptPath = path.join(OUT_DIRECTORY, scriptFile);
        fs.writeFileSync(scriptPath, BATCH_SCRIPT.replace('CMD', command));
    } else {
        // Create the script
        const scriptFile = `${command}.sh`;
        const scriptPath = path.join(OUT_DIRECTORY, scriptFile);
        fs.writeFileSync(scriptPath, SH_SCRIPT.replace('CMD', command));

        // Create binary from script
        await cmd(`shc -o ${command} -f ${scriptFile}`, {cwd: OUT_DIRECTORY});

        // Delete script files
        fs.unlinkSync(scriptPath);
        fs.unlinkSync(path.join(OUT_DIRECTORY, `${scriptFile}.x.c`));
    }
}

async function build() {
    await rimrafProm(OUT_DIRECTORY);

    await pkg.exec(['src/main.js', '--targets', 'node10', '--output', path.join(OUT_DIRECTORY, MAIN_BINARY)]);

    const cmds = Object.keys(commands);

    for (let i = 0; i < cmds.length; i++) {
        await createBinary(cmds[i]);
    }
}

build().catch(console.error);