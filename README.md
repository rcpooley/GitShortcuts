# Git Shortcuts

A generic shortcut tool for Git, written in TypeScript. Supports Windows and Linux (WSL).

## Installation

### From Source

1.  Clone the repository.
2.  Run `npm install`.
3.  Run `npm run build`.
4.  Run `npm install -g .`

### Setup

To use the short commands (e.g. `ga`, `gc`), you need to add aliases to your shell configuration.

**Automatic Setup (Linux/macOS):**

```bash
git-shortcuts install
```

This will append the necessary aliases to your `.bashrc`.

**Manual Setup:**
Run:

```bash
git-shortcuts init [bash|zsh|powershell]
```

Copy the output and append it to your `.bashrc`, `.zshrc`, or PowerShell profile.

## Usage

The following shortcuts are available (once aliases are configured):

-   `ga [files...]`: Git Add. Supports numeric selection from `gs`.
-   `gc <message>`: Git Commit. Takes the message as arguments (no quotes needed).
-   `gam`: Git Commit --amend --no-edit.
-   `gp`: Git Push.
-   `gco [branch]`: Git Checkout. Supports numeric selection from `gb`.
-   `gb`: Git Branch. Lists branches with numbers.
-   `gs`: Git Status. Lists files with numbers.
-   `gu [files...]`: Git Unstage (reset/rm --cached). Supports numeric selection.
-   `gd [files...]`: Git Diff. Supports numeric selection.

### Numeric Selection

Commands like `ga`, `gco`, `gu`, `gd` support numeric arguments referencing the index shown in `gs` (status) or `gb` (branch).

Example:

```bash
$ gs
...
#      modified: [1] src/main.ts
#      modified: [2] package.json

$ ga 1 2
# Adds src/main.ts and package.json
```
