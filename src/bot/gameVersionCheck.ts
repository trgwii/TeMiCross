import { EventEmitter } from 'events';
import axios from 'axios';

const getVersion = (type = 'release') =>
	axios('https://launchermeta.mojang.com/mc/game/version_manifest.json')
		.then(x => x.data.latest[type]);

const emitUpdates = (type = 'release', init = false) => {
	const e = new EventEmitter();
	let version = '';
	let stop = false;
	const check = v => {
		if ((version !== '' || init) && version !== v) {
			e.emit('update', v);
		}
		version = v;
		if (!stop) {
			setTimeout(() => getVersion(type).then(check), 10000);
		}
	};
	getVersion(type).then(check);
	e.stop = () => {
		stop = true;
	};
	return e;
};

export default emitUpdates;
