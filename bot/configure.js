'use strict';

const clientConfig = require('../client/configure');

const configure = [
	{
		type: 'input',
		name: 'token',
		message:
			'Enter the bot token you obtained from BotFather on Telegram:',
		validate: x => x.length > 10 && x.includes(':') ||
			'That doesn\'t look like a valid token, try again please!'
	},
	{
		type: 'input',
		name: 'chatID',
		message:
			'Enter the Telegram chat ID you want to ' +
			'forward messages from Minecraft to:',
		validate: x =>
			Number.isInteger(Number(x))
	},
	{
		type: 'confirm',
		name: 'allowList',
		message: 'Allow /list on Telegram?'
	},
	...clientConfig
];

module.exports = configure;
