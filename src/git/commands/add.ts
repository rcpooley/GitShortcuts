import { Util } from '../../util';
import { GitUtil } from '../gitUtil';
import { status } from './status';

export async function add(args: string[]): Promise<string> {
  await Util.multiCommand(args, (args, file) => {
    console.log(`# Adding '${file.name}'`);
    return GitUtil.git(['add', ...args, file.name]);
  });

  return await status([]);
}
