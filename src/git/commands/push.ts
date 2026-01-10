import { GitUtil } from '../gitUtil';

export async function push(args: string[]): Promise<string> {
  return await GitUtil.git(['push', ...args]);
}
