import { Util } from '../../util';
import { GitUtil } from '../gitUtil';

export async function diff(args: string[]): Promise<string> {
  await Util.multiCommand(args, (args, file) => {
    return GitUtil.git(['diff', ...args, file.name]);
  });
  return '';
}
