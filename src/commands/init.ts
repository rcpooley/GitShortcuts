
export async function init(args: string[]): Promise<string> {
  let shell = 'bash';
  if (args.length > 0) {
    shell = args[0].toLowerCase();
  } else if (process.platform === 'win32') {
    shell = 'powershell';
  }

  const aliases = {
    ga: 'git-shortcuts ga',
    gc: 'git-shortcuts gc',
    gam: 'git-shortcuts gam',
    gco: 'git-shortcuts gco',
    gb: 'git-shortcuts gb',
    gs: 'git-shortcuts gs',
    gu: 'git-shortcuts gu',
    gd: 'git-shortcuts gd'
  };

  let output = '';

  if (shell === 'powershell' || shell === 'pwsh') {
    output += "# Add this to your PowerShell profile (usually $PROFILE)\n";
    for (const [alias, cmd] of Object.entries(aliases)) {
      output += `function ${alias} { ${cmd} $args }\n`;
    }
  } else {
    // Bash / Zsh / Fish assumed
    output += "# Add this to your .bashrc, .zshrc, or .config/fish/config.fish\n";
    for (const [alias, cmd] of Object.entries(aliases)) {
      output += `alias ${alias}='${cmd}'\n`;
    }
  }

  return output;
}
