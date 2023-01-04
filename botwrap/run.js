"use strict";

const runWrapper = require("../wrap/run");
const runBot = require("../bot/run");

const run = (opts) => {
  const { stdin, stdout } = runWrapper(opts);
  const bot = runBot({ ...opts, stdin, stdout });
  return bot;
};

module.exports = run;
