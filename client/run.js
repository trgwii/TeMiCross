"use strict";

const { EOL } = require("os");
const { connect } = require("net");
const { createInterface } = require("readline");

const Parser = require("./parser");

const run = ({ port, ip, stdin, stdout, interactive = false, servertype }) => {
  const [output, input] =
    stdin && stdout
      ? [stdin, stdout]
      : ((x) => [x, x])(connect(Number(port), ip));
  output.on("close", () => {
    console.error("Lost connection to server, exiting...");
    process.stdin.pause();
  });
  const parser = Parser(servertype, input);
  if (interactive) {
    const rl = createInterface({ input: process.stdin });
    rl.on("line", (line) => output.write(line + EOL));
    parser.on("line", (line) => console.log(line));
  }
  parser.send = (x) => output.write(x + EOL);
  return parser;
};

module.exports = run;
