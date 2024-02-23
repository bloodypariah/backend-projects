const { program } = require("commander");
const key = require("../commands/key.js");
program
  .command("set")
  .description("Set API Key -- Enter API key")
  .action(() => key.set());

program
  .command("show")
  .description("Show API Key")
  .action(() => key.show());

program
  .command("remove")
  .description("Remove API key")
  .action(() => key.remove());

program.parse(process.argv);
