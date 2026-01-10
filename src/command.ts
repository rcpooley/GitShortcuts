export interface Command {
  (args: string[]): Promise<string>;
}
