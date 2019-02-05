'use strict';

const username = require('../username');

module.exports =
	'(?<user>' +
		username +
	') has reached the goal \\[(?<goal>.+)\\]$';
