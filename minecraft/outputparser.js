'use strict';

const { createInterface } = require('readline');

const time = '\\[(?<time>\\d{2}:\\d{2}:\\d{2})] ';
const threadLog = '\\[(?<thread>.*?)/(?<loglevel>.*?)\\]: ';

const prefix = time + threadLog;

const playerCount = 'There are (?<current>\\d+)/(?<max>\\d+) players online:';

const userName = '[a-zA-Z0-9_]{1,16}';

const playersOnline =
	'(?<players>(' +
		userName +
	')(\\s*,\\s*(' +
		userName +
	'))*)$';

const userMessage =
	'<(?<user>' + userName + ')> ';

const selfMessage =
	'\\* (?<user>' + userName + ') ';

const sayMessage = '\\[(?<user>.*?)\\] ';

const joinMessage =
	'(?<user>' + userName + ') joined the game$';

const leaveMessage =
	'(?<user>' + userName + ') left the game$';

const advancementMessage =
	'(?<user>' +
		userName +
	') has made the advancement \\[(?<advancement>.+)\\]$';

const goalMessage =
	'(?<user>' +
		userName +
	') has reached the goal \\[(?<goal>.+)\\]$';

const challengeMessage =
	'(?<user>' +
		userName +
	') has completed the challenge \\[(?<challenge>.+)\\]$';

const uuidMessage = 'UUID of player (?<user>\\w+) is (?<uuid>.+)$';

const deathMessage =
	'(?<user>' + userName + ') (?<message>' +
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

const keepingEntityMessage =
	'Keeping entity (?<game>\\w+):(?<mob>\\w+) ' +
	'that already exists with UUID (?<uuid>.+)$';

const message = '(?<message>.*)';

const Reader = stream => {
	const rl = createInterface({ input: stream });

	const messageFromUser =
		Object.assign(
			new RegExp(prefix + userMessage + message),
			{ info: { type: 'user_message' } });

	const selfMessageFromUser =
		Object.assign(
			new RegExp(prefix + selfMessage + message),
			{ info: { type: 'user_self_message' } });

	const messageFromServer =
		Object.assign(
			new RegExp(prefix + sayMessage + message),
			{ info: { type: 'server_message' } });

	const userJoined =
		Object.assign(
			new RegExp(prefix + joinMessage),
			{ info: { type: 'join_message' } });

	const userLeft =
		Object.assign(
			new RegExp(prefix + leaveMessage),
			{ info: { type: 'leave_message' } });

	const userDied =
		Object.assign(
			new RegExp(prefix + deathMessage),
			{ info: { type: 'death_message' } });

	const userAdvancement =
		Object.assign(
			new RegExp(prefix + advancementMessage),
			{ info: { type: 'advancement_message' } });

	const userGoal =
		Object.assign(
			new RegExp(prefix + goalMessage),
			{ info: { type: 'goal_message' } });

	const userChallenge =
		Object.assign(
			new RegExp(prefix + challengeMessage),
			{ info: { type: 'challenge_message' } });

	const onlineCount =
		Object.assign(
			new RegExp(prefix + playerCount),
			{ info: { type: 'online_count' } });

	const onlinePlayers =
		Object.assign(
			new RegExp(prefix + playersOnline),
			{ info: { type: 'online_players' } });

	const keptEntity =
		Object.assign(
			new RegExp(prefix + keepingEntityMessage),
			{ info: { type: 'keeping_entity_message' } });

	const userUUID =
		Object.assign(
			new RegExp(prefix + uuidMessage),
			{ info: { type: 'uuid_message' } });

	const handlers = [
		messageFromUser,
		selfMessageFromUser,
		messageFromServer,
		userJoined,
		userLeft,
		userDied,
		userAdvancement,
		userGoal,
		userChallenge,
		onlineCount,
		onlinePlayers,
		keptEntity,
		userUUID
	];

	rl.on('line', line =>
		handlers.forEach(handler => {
			const result = handler.exec(line);
			return result && rl.emit(handler.info.type,
				Object.assign({}, result.groups, handler.info));
		}));

	return rl;
};

module.exports = Reader;
