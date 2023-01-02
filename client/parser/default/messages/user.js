"use strict";

const username = require("../username");
const text = require("../text");

module.exports = "(\\\[(?<secure>.*?)\\\])? <(?<user>" + username + ")> " + text;
