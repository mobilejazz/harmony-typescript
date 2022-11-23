#!/usr/bin/env node
import { Command } from 'commander';

import { check } from '../src/commands/check.command.js';
import { generate } from '../src/commands/generate.command.js';

const program = new Command();

program.description('Mobile Jazz CLI').version('0.0.1').showHelpAfterError().addCommand(check).addCommand(generate);

async function main() {
    await program.parseAsync();
}

console.log(); // Add extra line before output
main();
