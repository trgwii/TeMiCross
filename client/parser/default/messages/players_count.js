'use strict';

const players = require('./players_online');

module.exports =
	'There are (?<current>\\d+) of a max (of )?(?<max>\\d+) players online: ' +
	players;
