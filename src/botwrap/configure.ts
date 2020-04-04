import wrapConfig from '../wrap/configure';
import botConfig from '../bot/configure';

const removeNetwork = (x: { name: string }) => !['port', 'ip'].includes(x.name);

type PortOrIpConfig = { name: 'port' } | { name: 'ip' };

type ConfigOpt =
	| Exclude<typeof wrapConfig[number], PortOrIpConfig>
	| Exclude<typeof botConfig[number], PortOrIpConfig>;

const configure = [
	...wrapConfig.filter(removeNetwork),
	...botConfig.filter(removeNetwork),
] as ConfigOpt[];

export default configure;
