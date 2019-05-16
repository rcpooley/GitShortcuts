const git = require('./git');

const modules = {git};

let commands = {};
Object.values(modules).forEach(cmds => {
    commands = Object.assign(commands, cmds);
});

module.exports = commands;