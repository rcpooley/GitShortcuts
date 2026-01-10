import { Util } from '../../util';
import { GitUtil } from '../gitUtil';
import { status } from './status';

export async function unstage(args: string[]): Promise<string> {
  await Util.multiCommand(args, (args, file) => {
    console.log(`# Unstaging '${file.name}'`);

    const cmd = file.type === 'A' ? 'rm --cached' : 'reset HEAD';

    return GitUtil.git(`${cmd} ${file.name}`);
  });

  return await status([]);
}
