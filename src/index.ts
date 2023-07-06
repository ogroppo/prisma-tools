#!/usr/bin/env node
import {Cli} from "./cli";
import {generate, generate2} from "./commands/generate";
import {version} from "./config";


Cli.program
.version(version(), "-v, --version", "display the current version number")
.description("A simple prisma toolkit for better dx");

// Cli.program
// .command("g")
// .argument("<output>", "the output file for the generated types")
// .description("generate types given a prisma schema and an optional types file")
// .action(async (out) => {
//   const clean_out = out.trim();
//   generate(clean_out);
// });

Cli.program
  .command("generate")
  .requiredOption("-i, --input <input>", "the prisma schema you want to generate types for")
  .requiredOption("-o, --output <output>", "the generated output file")
  .description("generate types given a prisma schema and an optional types file")
  .usage("-i ./prisma/schema.prisma -o ./prisma-type.ts")
  .action(async ({input, output}) => {
    generate2(input.trim(), output.trim());
  });


Cli.start();