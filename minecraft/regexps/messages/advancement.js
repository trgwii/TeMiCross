'use strict';

const username = require('../username');

module.exports =
	'(?<user>' +
		username +
	') has made the advancement \\[(?<advancement>.+)\\]$';
