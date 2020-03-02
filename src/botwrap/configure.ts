import wrapConfig from '../wrap/configure';
import botConfig from '../bot/configure';

const removeNetwork = x => ![ 'port', 'ip' ].includes(x.name);

const configure = [
	...wrapConfig.filter(removeNetwork),
	...botConfig.filter(removeNetwork)
];

export default configure;
