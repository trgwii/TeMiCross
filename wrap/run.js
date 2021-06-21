"use strict";

const { EOL, platform } = require("os");
const { spawn } = require("child_process");
const { createServer } = require("net");
const { createInterface } = require("readline");
const { decodeStream } = require("iconv-lite");

const bracketSplit = require("bracket-split");

const splitCommand = (x) => bracketSplit(" ", x, [], ['"']);

const logError = (err) =>
  // eslint-disable-next-line no-console
  console.error(err.name + ": " + err.message);

const rl = (stream) => createInterface({ input: stream });

const decode = (x) =>
  platform() === "win32" ? x.pipe(decodeStream("win1252")) : x;

const run = ({ port, ip, cmd }) => {
  const [command, ...args] = splitCommand(cmd).map((arg) =>
    arg.startsWith('"') && arg.endsWith('"') ? arg.slice(1, -1) : arg
  );

  const minecraftServer = spawn(command, args, {
    detached: true,
  });

  const { stdin } = minecraftServer;
  const stdout = decode(minecraftServer.stdout);
  const stderr = decode(minecraftServer.stderr);

  stdout.pipe(process.stdout);
  stderr.pipe(process.stderr);

  process.on("SIGINT", () => stdin.write("stop" + EOL));
  process.on("SIGTERM", () => stdin.write("stop" + EOL));

  const minecraftOutput = rl(stdout);
  const cliInput = rl(process.stdin);

  cliInput.on("line", (line) => stdin.write(line + EOL));

  if (port && ip) {
    const server = createServer((client) => {
      client.unref();
      client.on("error", logError);
      const clientOutput = rl(client);
      const clientWriter = (line) => client.write(line + EOL);
      clientOutput.on("line", (line) => stdin.write(line + EOL));
      minecraftOutput.on("line", clientWriter);
      client.on("close", () =>
        minecraftOutput.removeListener("line", clientWriter)
      );
    });

    minecraftServer.once("exit", () => {
      server.close();
      cliInput.close();
    });

    server.listen(port, ip);
  }
  return {
    stderr,
    stdin,
    stdout,
  };
};

module.exports = run;
