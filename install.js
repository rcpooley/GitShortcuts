const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
const Registry = require('winreg');
const config = require('./config.json');

const BIN_DIRECTORY = config.binaryDirectory;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let readLineResolve = null;
rl.on('line', line => {
    readLineResolve(line);
});

function readLine(prompt) {
    if (prompt) {
        process.stdout.write(prompt);
    }
    return new Promise(resolve => {
        readLineResolve = resolve;
    });
}

function getRegPathKey() {
    return new Registry({
        hive: Registry.HKCU,
        key: '\\Environment'
    });
}

function getEnvPath() {
    return new Promise((resolve, reject) => {
        getRegPathKey().values((err, items) => {
            if (err) {
                reject(err);
                return;
            }

            const pathItems = items.filter(item => item.name.toLowerCase() === 'path');

            if (pathItems.length === 0) {
                reject(new Error('No path variable found'));
                return;
            }

            resolve(pathItems[0]);
        });
    });
}

function addToPath(path) {
    return new Promise(async (resolve, reject) => {
        try {
            const envPathObj = await getEnvPath();
            let envPath = envPathObj.value;
            if (envPath.includes(path)) {
                resolve();
                return;
            }
            if (!envPath.endsWith(';')) envPath += ';';
            envPath += path;

            getRegPathKey().set('Path', envPathObj.type, envPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function removeFromPath(path) {
    return new Promise(async (resolve, reject) => {
        try {
            let needle = path;
            if (!needle.endsWith(';')) {
                needle += ';';
            }
            const envPathObj = await getEnvPath();
            let envPath = envPathObj.value;
            if (!envPath.endsWith(';')) envPath += ';';
            envPath = envPath.replace(needle, '');

            getRegPathKey().set('Path', envPathObj.type, envPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function main() {
    // Make sure binaries are built
    if (!fs.existsSync(BIN_DIRECTORY) || !fs.lstatSync(BIN_DIRECTORY).isDirectory()) {
        console.log("Could not find binaries. Please run 'npm run build'");
        return;
    }

    // Get installation directory
    const defaultInstallDirectory = path.join(process.env.APPDATA, 'GitShortcuts');
    let installDirectory = (await readLine(`Installation directory [${defaultInstallDirectory}]: `)).trim();
    if (installDirectory.length === 0) {
        installDirectory = defaultInstallDirectory;
    }

    // Copy binaries to installation directory
    await fs.copy(BIN_DIRECTORY, installDirectory);

    // Add directory to path
    await addToPath(installDirectory);

    console.log(`Successfully installed GitShortcuts to ${installDirectory}`);
}

main()
    .then(() => rl.close())
    .catch(console.error);