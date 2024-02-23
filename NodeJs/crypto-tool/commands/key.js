const inquirer = require("inquirer");
require("colors");
const KeyManager = require("../lib/KeyManager.js");
const { isRequired } = require("../utils/validation.js");

const key = {
  async set() {
    const keyManager = new KeyManager();
    const input = await inquirer.prompt([
      {
        type: "input",
        name: "key",
        message: "Enter API key ".green + "https://nomics.com",
        validate: isRequired,
      },
    ]);

    const key = keyManager.setKey(input.key);

    if (key) {
      console.log("API key set".blue);
    }
  },
  show() {
    try {
      const keyManager = new KeyManager();
      const key = keyManager.getKey();

      console.log("Current API key: ", key.yellow);
      return key;
    } catch (err) {
      console.error(err.message.red);
    }
  },
  remove() {
    try {
      const keyManager = new KeyManager();
      keyManager.deleteKey();

      console.log("Key removed".blue);
      return;
    } catch (err) {
      console.error(err.message.red);
    }
  },
};

module.exports = key;
