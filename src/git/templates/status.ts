import { Colors as C } from '../../colors';
import { Symbols as S } from '../../symbols';
import { FileEntry } from '../../util';

const typeNames: { [key: string]: string } = {
  M: 'modified',
  D: 'deleted',
  R: 'renamed',
  A: 'new file',
  '?': 'untracked'
};

export function renderStatus(getNumber: (name: string, data: FileEntry) => number, data: any): string {
  let out = `# On branch: ${C.Bright}${data.currentBranch}${C.Reset}\n#\n`;

  const addFiles = (files: FileEntry[], title: string, color: string) => {
    if (!files) return;
    if (files.length === 0) return;
    out += `${color}${S.arrow}${C.Reset} ${title}\n${color}#\n`;
    files.forEach(file => {
      const num = getNumber(file.name, file);
      const type = file.type in typeNames ? typeNames[file.type] : 'unknown';
      const name = file.type === 'R' && 'rawName' in file ? file.rawName : file.name;
      out += `#      ${type.padStart(9)}: ${C.Reset}[${num}]${color} ${name}\n`;
    });
    out += `#${C.Reset}\n`;
  };

  addFiles(data.files.staged, 'Changes to be committed', C.FgGreen);
  addFiles(data.files.unstaged, 'Changes not staged for commit', C.FgYellow);
  addFiles(data.files.untracked, 'Untracked files', C.FgCyan);

  return out;
}
