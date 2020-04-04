#!/usr/bin/env node

import * as inquirer from 'inquirer';
import r from '@codefeathers/runtype';

import { Settings } from './settings';

import load from './load';
import save from './save';

import bot from '../bot';
import botwrap from '../botwrap';
import client from '../client';
import wrap from '../wrap';

const plugins = {
	bot,
	botwrap,
	client,
	wrap,
};

const args = process.argv.slice(2);
const command = args.shift();
const reconfigure = args[0] && args[0].startsWith('conf');

const helpText = `Possible arguments:
${Object.keys(plugins)
	.map(x => `\t${x}`)
	.join('\n')}
`;

const run = (
	plugin: typeof plugins[keyof typeof plugins],
	settings: Settings,
) => {
	save(plugin.file, settings);
	plugin.run({ ...settings, interactive: true });
};

const addDefaults = (configure: { name: string }[], existing: Settings) =>
	configure.map(question => ({
		...question,
		defaut: existing[question.name as keyof Settings],
	}));

async function main() {
	if (r.has(plugins)(command)) {
		const plugin = plugins[command];
		const existingSettings = load<Settings>(plugin.file);

		if (reconfigure && existingSettings) {
			const configure = plugin.configure as { name: string }[];
			const settings = await inquirer.prompt<Settings>(
				addDefaults(configure, existingSettings),
			);
			run(plugin, settings);
		} else if (!reconfigure && !existingSettings) {
			const settings = await inquirer.prompt<Settings>(plugin.configure);
			run(plugin, settings);
		}
	} else if (!command || command.length === 0) {
		console.log(helpText);
	} else {
		process.exitCode = 1;
		console.error('Unknown command: ' + command);
	}
}

main();
