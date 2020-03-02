'use strict';

const wrapConfig = require('../wrap/configure');
const botConfig = require('../bot/configure');

const removeNetwork = x => ![ 'port', 'ip' ].includes(x.name);

const configure = [
	...wrapConfig.filter(removeNetwork),
	...botConfig.filter(removeNetwork)
];

module.exports = configure;
