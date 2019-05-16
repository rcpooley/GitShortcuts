const C = require('../../../colors');
const S = require('../../../symbols');

const typeNames = {
    M: 'modified',
    D: 'deleted',
    R: 'renamed',
    A: 'new file',
    '?': 'untracked'
};

module.exports = function (getNumber, data) {
    let out = `# On branch: ${C.Bright}${data.currentBranch}${C.Reset}\n#\n`;

    const addFiles = (files, title, color) => {
        if (!files) return;
        if (files.length === 0) return;
        out += `${color}${S.arrow}${C.Reset} ${title}\n${color}#\n`;
        files.forEach(file => {
            const num = getNumber(file.name, file);
            const type = file.type in typeNames ? typeNames[file.type] : 'unknown';
            const name = file.type === 'R' ? file.rawName : file.name;
            out += `#      ${type.padStart(9)}: ${C.Reset}[${num}]${color} ${name}\n`;
        });
        out += `#${C.Reset}\n`;
    };

    addFiles(data.files.staged, 'Changes to be committed', C.FgGreen);
    addFiles(data.files.unstaged, 'Changes not staged for commit', C.FgYellow);
    addFiles(data.files.untracked, 'Untracked files', C.FgCyan);

    return out;
};