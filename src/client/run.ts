import { EOL } from 'os';
import { connect } from 'net';
import { createInterface } from 'readline';

import Parser from './parser';

const run = ({ port, ip, stdin, stdout, interactive = false, servertype }) => {
	const [ output, input ] = stdin && stdout
		? [ stdin, stdout ]
		: (x => [ x, x ])(connect(Number(port), ip));
	output.on('close', () => {
		console.error('Lost connection to server, exiting...');
		process.stdin.pause();
	});
	const parser = Parser(servertype, input);
	if (interactive) {
		const rl = createInterface({ input: process.stdin });
		rl.on('line', line =>
			output.write(line + EOL));
		parser.on('line', line =>
			console.log(line));
	}
	parser.send = x => output.write(x + EOL);
	return parser;
};

export default run;
