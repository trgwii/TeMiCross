'use strict';

const { isIP } = require('net');

const configure = [
	{
		type: 'input',
		name: 'port',
		message:
			'Which port do you want the TCP wrapper to listen on?',
		default: 12345,
		validate: x =>
			Number.isInteger(Number(x))
	},
	{
		type: 'input',
		name: 'ip',
		message:
			'Which interface / IP do you want the TCP wrapper to listen on?',
		default: '127.0.0.1',
		validate: x =>
			isIP(x) > 0
	},
	{
		type: 'input',
		name: 'cmd',
		message:
			'Enter the command you use to run your minecraft server:',
		default: 'java -Xmx1024M -Xms1024M -jar server.jar nogui'
	}
];

module.exports = configure;
