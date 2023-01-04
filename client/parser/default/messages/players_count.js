"use strict";

const players = require("./players_online");

module.exports =
  "There are (?<current>\\d+) (out )?of (a )?max(imum)? (of )?(?<max>\\d+) players online(:|.) " +
  players;
