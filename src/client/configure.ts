import { isIP } from 'net';

const configure = [
	{
		type: 'input',
		name: 'port',
		message: 'Which port do you want the client to connect to?',
		default: 12345,
		validate: (x: string | number) => Number.isInteger(Number(x)),
		filter: (x: string | number) => Number(String(x).trim()),
	},
	{
		type: 'input',
		name: 'ip',
		message: 'Which interface / IP do you want the client to connect to?',
		default: '127.0.0.1',
		validate: (x: string) => isIP(x) > 0,
		filter: (x: string) => x.trim(),
	},
] as const;

export default configure;
