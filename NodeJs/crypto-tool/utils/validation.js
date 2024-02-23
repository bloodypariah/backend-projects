// Required fields

const isRequired = (input) =>
  !input || input.trim() === "" ? "This value is required" : true;

module.exports = { isRequired };
