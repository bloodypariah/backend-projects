#!/usr/bin/env node

const { program } = require("commander");
const pkg = require("../package.json");

program
  .version(pkg.version)
  .command("key", "Manage API key")
  .command("check", "Check coin price info");
program.parse(process.argv);
