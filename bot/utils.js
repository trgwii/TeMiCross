"use strict";

const fs = require("fs");

const {
  __,
  compose,
  concat,
  flip,
  join,
  prop,
  props,
  replace,
  tap,
} = require("ramda");

const load = compose(JSON.parse, flip(fs.readFileSync)("utf8"));

const escape = compose(
  replace(/>/g, "&gt;"),
  replace(/</g, "&lt;"),
  replace(/&/g, "&amp;"),
  String
);

const code = compose(concat(__, "</code>"), concat("<code>"), escape);

const name = prop("first_name");

const log = tap(console.log);

const logError = tap(
  compose(console.error, join(": "), props(["name", "message"]))
);

module.exports = {
  code,
  escape,
  load,
  log,
  logError,
  name,
};
