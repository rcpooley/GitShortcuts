import stripAnsi = require('strip-ansi');
import { FileEntry, Util } from '../../util';
import { GitUtil } from '../gitUtil';
import { renderStatus } from '../templates/status';

interface StatusData {
  currentBranch: string;
  files: {
    staged: FileEntry[];
    unstaged: FileEntry[];
    untracked: FileEntry[];
  };
}

export async function status(args: string[]): Promise<string> {
  if (args.length > 0) {
    args.unshift('status');
    return await GitUtil.git(args);
  }

  const out = await GitUtil.git('status -s -b');

  const data = parseOutput(out);

  return Util.renderTemplate(renderStatus, 'file', data);
}

function parseOutput(rawOut: string): StatusData {
  const lines = stripAnsi(rawOut)
    .split('\n')
    .filter(line => line.length > 0);

  const data: StatusData = {
    currentBranch: '<unknown>',
    files: {
      staged: [],
      unstaged: [],
      untracked: []
    },
  };

  // Parse lines
  lines.forEach(line => {
    const x = line.charAt(0);
    const y = line.charAt(1);
    const rawName = line.substring(3);

    if (x === '#' && y === '#') {
      data.currentBranch = rawName;
      return;
    }

    let name = rawName;
    const spl = name.split(' -> ');
    if (spl.length === 2) {
      name = spl[1];
    }

    const file: FileEntry = {
      // @ts-ignore
      rawName,
      name,
      type: '',
      data: null // adding data to satisfy interface
    };

    if (x === '?' && y === '?') {
      data.files.untracked.push({
        ...file,
        type: '?'
      });
      return;
    }

    if (x !== ' ') {
      data.files.staged.push({
        ...file,
        type: x
      });
    }

    if (y !== ' ') {
      data.files.unstaged.push({
        ...file,
        type: y
      });
    }
  });

  return data;
}
