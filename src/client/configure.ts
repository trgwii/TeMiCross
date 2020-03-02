import { isIP } from 'net';

const configure = [
	{
		type: 'input',
		name: 'port',
		message:
			'Which port do you want the client to connect to?',
		default: 12345,
		validate: x =>
			Number.isInteger(Number(x)),
		filter: x => Number(String(x).trim())
	},
	{
		type: 'input',
		name: 'ip',
		message:
			'Which interface / IP do you want the client to connect to?',
		default: '127.0.0.1',
		validate: x =>
			isIP(x) > 0,
		filter: x => x.trim()
	}
];

export default configure;
