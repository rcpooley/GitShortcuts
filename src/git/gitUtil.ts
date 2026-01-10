import { Util } from '../util';

export class GitUtil {
  static git(cmd: string | string[]): Promise<string> {
    return Util.cmd('git', cmd);
  }
}
