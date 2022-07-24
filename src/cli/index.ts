import { Command } from "commander";


export class Cli {

  private static _program?: Command;

  private static get args(): string[] {
    return process.argv;
  }

  public static get program(): Command {
    if (!Cli._program) {
      Cli._program = new Command();
    }

    return Cli._program;
  }

  public static start(): void {
    Cli.program.parse(Cli.args);
  }
}