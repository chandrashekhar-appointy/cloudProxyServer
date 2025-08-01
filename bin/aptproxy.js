#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createToken } from '../lib/commands/createToken.js';
import { query } from '../lib/commands/query.js';

const program = new Command();

program
  .name('aptproxy')
  .description('CLI tool for AptProxy database proxy server')
  .version('1.0.0');

// Create token command
program
  .command('createToken')
  .description('Create and store authentication token')
  .option('-n, --name <name>', 'User name')
  .option('-p, --position <position>', 'User position')
  .action(createToken);

// Query command
program
  .command('query <sql>')
  .description('Execute SQL query on remote database')
  .action(query);

// Display help if no command provided
program.parse();

if (!process.argv.slice(2).length) {
  program.outputHelp();
} 