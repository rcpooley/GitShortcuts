import { Util } from '../../util';
import { GitUtil } from '../gitUtil';

export async function commit(args: string[]): Promise<string> {
  const message = await Util.input('Commit message: ');

  return await GitUtil.git(['commit', ...Util.replaceArgs(args), '-m', `"${message}"`]);
}
