"use strict";

const username = require("../username");

module.exports =
  "(?<user>" +
  username +
  ") (\\(formerly known as " +
  username +
  "\\) )?joined the game$";
