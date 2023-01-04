#!/usr/bin/env node
"use strict";

const inquirer = require("inquirer");

const load = require("./load");
const save = require("./save");

const plugins = {
  /* eslint-disable global-require */
  bot: () => require("../bot"),
  botwrap: () => require("../botwrap"),
  client: () => require("../client"),
  wrap: () => require("../wrap"),
  /* eslint-enable global-require */
};

const args = process.argv.slice(2);
const command = args.shift();
const reconfigure = args[0] && args[0].startsWith("conf");

if (plugins[command]) {
  const plugin = plugins[command]();
  return Promise.resolve(load(plugin.file))
    .then((settings) =>
      // eslint-disable-next-line operator-linebreak
      settings && !reconfigure
        ? settings
        : inquirer.prompt(
            settings
              ? plugin.configure.map((question) =>
                  settings[question.name]
                    ? {
                        ...question,
                        default: settings[question.name],
                      }
                    : question
                )
              : plugin.configure
          )
    )
    .then((settings) => save(plugin.file, settings))
    .then((settings) => plugin.run({ ...settings, interactive: true }));
}

const helpText = `Possible arguments:
${Object.keys(plugins)
  .map((x) => `\t${x}`)
  .join("\n")}
`;

if (!command || command.length === 0) {
  return console.log(helpText);
}
// eslint-disable-next-line no-console
process.exitCode = 1;
return console.error("Unknown command: " + command);
