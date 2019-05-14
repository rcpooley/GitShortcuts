const C = require('./colors');
const S = require('./symbols');

const typeNames = {
    M: 'modified',
    D: 'deleted',
    R: 'renamed',
    A: 'new file',
    '?': 'untracked'
};

const hgTypeNames = {
    M: 'modified',
    A: 'new file',
    R: 'deleted',
    '?': 'untracked',
    '!': 'missing'
};

module.exports = function (git) {
    const tNames = git.hg ? hgTypeNames : typeNames;

    let out = '';

    if (!git.hg) {
        out += `# On branch: ${C.Bright}${git.currentBranch}${C.Reset}\n#\n`;
    }

    const addFiles = (files, title, color) => {
        if (!files) return;
        if (files.length === 0) return;
        out += `${color}${S.arrow}${C.Reset} ${title}\n${color}#\n`;
        files.forEach(file => {
            const num = git.getNumber(file);
            const type = file.type in tNames ? tNames[file.type] : 'unknown';
            out += `#      ${type.padStart(9)}: ${C.Reset}[${num}]${color} ${file.displayName}\n`;
        });
        out += `#${C.Reset}\n`;
    };

    addFiles(git.files.staged, 'Changes to be committed', C.FgGreen);
    addFiles(git.files.unstaged, 'Changes not staged for commit', C.FgYellow);
    addFiles(git.files.hgChanged, 'Changed files', C.FgGreen);
    addFiles(git.files.untracked, 'Untracked files', C.FgCyan);

    return out;
};