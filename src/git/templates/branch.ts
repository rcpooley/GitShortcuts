import { Colors as C } from '../../colors';

export function renderBranch(getNumber: (name: string, data: string) => number, data: any): string {
  const { branches, currentBranch } = data;

  let out = '';

  branches.forEach((branch: string) => {
    const num = getNumber(branch, branch);
    if (branch === currentBranch) {
      out += `* [${num}] ${C.FgGreen}${branch}${C.Reset}\n`;
    } else {
      out += `  [${num}] ${branch}\n`;
    }
  });

  return out;
}
