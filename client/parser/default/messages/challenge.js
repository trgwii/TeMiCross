'use strict';

const username = require('../username');

module.exports =
	'(?<user>' +
		username +
	') has completed the challenge \\[(?<challenge>.+)\\]$';
