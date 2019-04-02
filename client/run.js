'use strict';

const { EOL } = require('os');
const { connect } = require('net');
const { createInterface } = require('readline');

const Parser = require('./parser');

const run = ({ port, ip, interactive = false, servertype }) => {
	const conn = connect(Number(port), ip);
	conn.on('close', () => {
		console.error('Lost connection to server, exiting...');
		process.stdin.pause();
	});
	const parser = Parser(servertype, conn);
	if (interactive) {
		const rl = createInterface({ input: process.stdin });
		rl.on('line', line =>
			conn.write(line + EOL));
		parser.on('line', line =>
			console.log(line));
	}
	parser.send = x => conn.write(x + EOL);
	return parser;
};

module.exports = run;
