'use strict';

const username = require('../username');

module.exports = '(?<user>' +
	username +
	'|.+?) has the following entity data: (?<data>.+)$';
