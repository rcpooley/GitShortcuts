import { Command } from './command';
import { init } from './commands/init';
import { commands as gitCommands } from './git';

export const commands: { [key: string]: Command } = {
  ...gitCommands,
  init: init
};
