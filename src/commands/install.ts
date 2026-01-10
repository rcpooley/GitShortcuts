import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const BEGIN_MARKER = '# git-shortcuts aliases begin';
const END_MARKER = '# git-shortcuts aliases end';

function generateAliasBlock(): string {
  const aliases = [
    "alias ga='git-shortcuts ga'",
    "alias gc='git-shortcuts gc'",
    "alias gam='git-shortcuts gam'",
    "alias gco='git-shortcuts gco'",
    "alias gb='git-shortcuts gb'",
    "alias gp='git-shortcuts gp'",
    "alias gs='git-shortcuts gs'",
    "alias gu='git-shortcuts gu'",
    "alias gd='git-shortcuts gd'"
  ];

  return `${BEGIN_MARKER}\n${aliases.join('\n')}\n${END_MARKER}`;
}

export async function install(_args: string[]): Promise<string> {
  const bashrcPath = path.join(os.homedir(), '.bashrc');

  if (!fs.existsSync(bashrcPath)) {
    return `Error: ${bashrcPath} not found\n`;
  }

  let content = fs.readFileSync(bashrcPath, 'utf-8');
  const aliasBlock = generateAliasBlock();

  // Check if alias block already exists
  const beginIndex = content.indexOf(BEGIN_MARKER);
  const endIndex = content.indexOf(END_MARKER);

  if (beginIndex !== -1 && endIndex !== -1 && endIndex > beginIndex) {
    // Replace existing block
    const before = content.substring(0, beginIndex);
    const after = content.substring(endIndex + END_MARKER.length);
    content = before + aliasBlock + after;
    fs.writeFileSync(bashrcPath, content);
    return `Updated git-shortcuts aliases in ${bashrcPath}\nRestart your shell or run: source ~/.bashrc\n`;
  } else {
    // Append new block
    const newContent = content.endsWith('\n')
      ? content + '\n' + aliasBlock + '\n'
      : content + '\n\n' + aliasBlock + '\n';
    fs.writeFileSync(bashrcPath, newContent);
    return `Added git-shortcuts aliases to ${bashrcPath}\nRestart your shell or run: source ~/.bashrc\n`;
  }
}
