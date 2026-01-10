import { Util } from '../../util';
import { GitUtil } from '../gitUtil';

export async function checkout(args: string[]): Promise<string> {
  return GitUtil.git(['checkout', ...Util.replaceArgs(args)]);
}
