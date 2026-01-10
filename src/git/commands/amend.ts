import { Util } from '../../util';
import { GitUtil } from '../gitUtil';

export async function amend(args: string[]): Promise<string> {
  return await GitUtil.git(['commit', '--amend', '--no-edit', ...Util.replaceArgs(args)]);
}
