'use strict';

const { EventEmitter } = require('events');
const axios = require('axios');

const getVersion = (type = 'release') =>
	axios('https://launchermeta.mojang.com/mc/game/version_manifest.json')
		.then(x => x.data.latest[type]);

const emitUpdates = (type = 'release', init = false) => {
	const e = new EventEmitter();
	let version = '';
	const check = v => {
		if ((version !== '' || init) && version !== v) {
			e.emit('update', v);
		}
		version = v;
		setTimeout(() => getVersion(type).then(check), 10000);
	};
	getVersion(type).then(check);
	return e;
};

module.exports = emitUpdates;
