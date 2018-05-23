'use strict';

const username = require('./username');

module.exports =
	'(?<players>(' +
		username +
	')(\\s*,\\s*(' +
		username +
	'))*)$';
