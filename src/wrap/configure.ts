import { isIP } from 'net';

const configure = [
	{
		type: 'input',
		name: 'port',
		message: 'Which port do you want the TCP wrapper to listen on?',
		default: 12345,
		validate: (x: string) => Number.isInteger(Number(x)),
		filter: (x: string) => Number(String(x).trim()),
	},
	{
		type: 'input',
		name: 'ip',
		message: 'Which interface / IP do you want the TCP wrapper to listen on?',
		default: '127.0.0.1',
		validate: (x: string) => isIP(x) > 0,
		filter: (x: string) => x.trim(),
	},
	{
		type: 'input',
		name: 'cmd',
		message: 'Enter the command you use to run your minecraft server:',
		default: 'java -Xmx1024M -Xms1024M -jar server.jar nogui',
	},
] as const;

export default configure;
