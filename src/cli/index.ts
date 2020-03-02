#!/usr/bin/env node

import * as inquirer from 'inquirer';

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
	wrap
};

const args = process.argv.slice(2);
const command = args.shift();
const reconfigure = args[0] && args[0].startsWith('conf');


const helpText = `Possible arguments:
${Object.keys(plugins).map(x => `\t${x}`).join('\n')}
`;

if (!command || command.length === 0) {
	console.log(helpText);
} else if (!plugins[command]) {
	// eslint-disable-next-line no-console
	process.exitCode = 1;
	console.error('Unknown command: ' + command);
} else {
	const plugin = plugins[command]();
	Promise.resolve(load<Settings>(plugin.file))
		.then(settings =>
			// eslint-disable-next-line operator-linebreak
			settings && !reconfigure ? settings :
				inquirer.prompt<typeof settings>(
					settings
						? plugin.configure.map(question =>
							settings[question.name]
								? {
									...question,
									default: settings[question.name]
								}
								: question)
						: plugin.configure))
		.then(settings =>
			save<typeof settings>(plugin.file, settings))
		.then(settings =>
			plugin.run({ ...settings, interactive: true }));
}
