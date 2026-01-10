#!/usr/bin/env node
import { commands } from './commands';

const main = async () => {
  if (process.argv.length < 3) {
    console.log('No command provided');
    process.exit(0);
  }

  const cmd = process.argv[2];
  const args = process.argv.slice(3);

  if (cmd === 'HELP') {
    console.log('Available commands:', Object.keys(commands).join(', '));
    process.exit(0);
  }

  if (!(cmd in commands)) {
    console.log(`Unrecognized command: ${cmd}`);
    process.exit(0);
  }

  try {
    const out = await commands[cmd](args);
    if (out && out.length > 0) {
      process.stdout.write(out);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
