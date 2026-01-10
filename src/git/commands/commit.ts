import { GitUtil } from '../gitUtil';

export async function commit(args: string[]): Promise<string> {
  const message = args.join(' ');

  if (!message) {
    console.error('Usage: gc <commit message>');
    process.exit(1);
  }

  return await GitUtil.git(['commit', '-m', `"${message}"`]);
}
