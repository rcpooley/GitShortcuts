import { Command } from '../command';
import { add } from './commands/add';
import { amend } from './commands/amend';
import { branch } from './commands/branch';
import { checkout } from './commands/checkout';
import { commit } from './commands/commit';
import { diff } from './commands/diff';
import { status } from './commands/status';
import { unstage } from './commands/unstage';

export const commands: { [key: string]: Command } = {
  ga: add,
  gam: amend,
  gb: branch,
  gco: checkout,
  gc: commit,
  gs: status,
  gu: unstage,
  gd: diff,
};
