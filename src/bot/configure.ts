'use strict';

const clientConfig = require('../client/configure');

const configure = [
	{
		type: 'input',
		name: 'token',
		message:
			'Enter the bot token you obtained from BotFather on Telegram:',
		validate: x => x.length > 10 && x.includes(':') ||
			'That doesn\'t look like a valid token, try again please!',
		filter: x => x.trim()
	},
	{
		type: 'input',
		name: 'chatID',
		message:
			'Enter the Telegram chat ID you want to ' +
			'forward messages from Minecraft to:',
		validate: x =>
			Number.isInteger(Number(x)),
		filter: x => x.trim()
	},
	{
		type: 'confirm',
		name: 'allowList',
		message: 'Allow /list on Telegram?'
	},
	{
		type: 'confirm',
		name: 'localAuth',
		message: '(for cracked servers) Use local auth?',
		default: false
	},
	{
		type: 'confirm',
		name: 'postUpdates',
		message: 'Notify Telegram about game updates?',
		default: false
	},
	...clientConfig
];

module.exports = configure;
