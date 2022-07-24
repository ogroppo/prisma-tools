#!/usr/bin/env node
import { Cli } from "./cli";
import { generate } from "./commands/generate";
import { version } from "./config";


Cli.program
  .version(version(), "-v, --version", "display the current version number")
  .description("A simple prisma toolkit for better dx");

Cli.program
  .command("g")
  .argument("<output>", "the output file for the generated types")
  .description("generate types given a prisma schema and an optional types file")
  .action(async (out) => {
    const clean_out = out.trim();
    generate(clean_out);
  });


Cli.start();