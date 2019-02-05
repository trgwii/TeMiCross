'use strict';

const username = require('../username');

module.exports =
	'(?<user>' +
		username +
	') (?<text>' +
		'was (' +
			'shot by .+|' +
			'shot off (some vines|a ladder) by .+|' +
			'pricked to death|' +
			'stabbed to death|' +
			'squished too much|' +
			'blown up by .+|' +
			'killed by .+|' +
			'doomed to fall by .+|' +
			'blown from a high place by .+|' +
			'squashed by a falling (anvil|block)|' +
			'burnt to a crisp whilst fighting .+|' +
			'struck by lightning|' +
			'slain by .+|' +
			'fireballed by .+|' +
			'killed by (.+ using )?magic|' +
			'killed while trying to hurt .+|' +
			'impaled by .+|' +
			'pummeled by .+' +
		')|' +
		'hugged a cactus|' +
		'walked into a cactus while trying to escape .+|' +
		'drowned( whilst trying to escape .+)?|' +
		'suffocated in a wall|' +
		'experienced kinetic energy|' +
		'removed an elytra while flying|' +
		'blew up|' +
		'hit the ground too hard|' +
		'went up in flames|' +
		'burned to death|' +
		'walked into a fire whilst fighting .+|' +
		'went off with a bang|' +
		'tried to swim in lava( while trying to escape .+)?|' +
		'discovered floor was lava|' +
		'walked into danger zone due to .+|' +
		'got finished off by .+|' +
		'starved to death|' +
		'didn\'t want to live in the same world as .+|' +
		'withered away|' +
		'died|' +
		'fell (' +
			'from a high place( and fell out of the world)?|' +
			'off a ladder|' +
			'off some vines|' +
			'out of the water|' +
			'into a patch of fire|' +
			'into a patch of cacti|' +
			'out of the world' +
		')' +
	')$';
