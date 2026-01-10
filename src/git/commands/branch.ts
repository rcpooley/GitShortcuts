import stripAnsi = require('strip-ansi');
import { Util } from '../../util';
import { GitUtil } from '../gitUtil';
import { renderBranch } from '../templates/branch';

interface BranchData {
  currentBranch: string | null;
  branches: string[];
  valid: boolean;
}

export async function branch(args: string[]): Promise<string> {
  const out = await GitUtil.git(['branch', ...Util.replaceArgs(args)]);

  const data = parseOutput(out);

  // Return raw output if the output isn't what we expected
  if (!data.valid) {
    return out;
  }

  return Util.renderTemplate(renderBranch, 'branch', data);
}

function parseOutput(rawOut: string): BranchData {
  const out = stripAnsi(rawOut);

  const lines = out.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const data: BranchData = {
    currentBranch: null,
    branches: [],
    valid: true,
  };

  lines.forEach(line => {
    const spl = line.split(' ').filter(s => s.length > 0);
    const active = spl[0] === '*';
    if (active) {
      spl.splice(0, 1);
      data.currentBranch = spl[0];
    }
    data.branches.push(spl[0]);
    if (spl.length > 1) {
      data.valid = false;
    }
  });

  if (data.currentBranch === null) {
    data.valid = false;
  }

  return data;
}
