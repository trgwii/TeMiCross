#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');

const load = require('./load');
const save = require('./save');

const r = require;

const plugins = {
	bot: () => r('../bot'),
	client: () => r('../client'),
	wrap: () => r('../wrap')
};

const args = process.argv.slice(2);
const command = args.shift();

if (plugins[command]) {
	const plugin = plugins[command]();
	return Promise.resolve(load(plugin.file))
		.then(settings =>
			settings ||
				inquirer.prompt(plugin.configure))
		.then(settings =>
			save(plugin.file, settings))
		.then(settings =>
			plugin.run({ ...settings, interactive: true }));
}
// eslint-disable-next-line no-console
return console.error('Unknown command: ' + command);
