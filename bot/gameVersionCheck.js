'use strict';

const { EventEmitter } = require('events');
const axios = require('axios');

const getVersion = () =>
	axios('https://launchermeta.mojang.com/mc/game/version_manifest.json')
		.then(x => x.data.latest.release);

const emitUpdates = () => {
	const e = new EventEmitter();
	let version = '';
	const check = v => {
		if (version !== '' && version !== v) {
			e.emit('update', v);
		}
		version = v;
		setTimeout(() => getVersion().then(check), 10000);
	};
	getVersion().then(check);
	return e;
};

module.exports = emitUpdates;
