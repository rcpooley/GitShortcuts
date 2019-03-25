const commands = require('./commands');

if (process.argv.length < 3) {
    console.log('No command provided');
    process.exit(0);
}

const cmd = process.argv[2];
const args = process.argv.slice(3);

if (!(cmd in commands)) {
    console.log(`Unrecognized command: ${cmd}`);
    process.exit(0);
}

commands[cmd](args)
    .then(out => process.stdout.write(out))
    .catch(console.error);