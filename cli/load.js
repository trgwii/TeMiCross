"use strict";

const r = require;

const { resolve } = require("path");

const load = (name) => {
  try {
    return r(resolve(`${name}.json`));
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      return null;
    }
    throw err;
  }
};

module.exports = load;
