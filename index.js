'use strict';

const { connect } = require('net');

const R = require('ramda');
const Telegraf = require('telegraf');

const Reader = require('./minecraft/outputparser');

const {
	messageJSON,
	textJSON
} = require('./minecraft/messageJSON');

const {
	code,
	escape,
	logError
} = require('./utils');

const tgID = process.env.TELEGRAM_CHAT;
const botID = R.head(R.split(':', process.env.TELEGRAM_BOT_TOKEN));
const tgOpts = { parse_mode: 'HTML' };

const splitSpace = R.split(' ');
const joinSpace = R.join(' ');

const [
	id,
	chat,
	from,
	text,
	message,
	lastName,
	firstName,
	reply
] = R.map(R.prop, [
	'id',
	'chat',
	'from',
	'text',
	'message',
	'last_name',
	'first_name',
	'reply_to_message'
]);

const chatID = R.o(id, chat);
const fromID = R.o(id, from);
const fromLastName = R.o(lastName, from);
const fromFirstName = R.o(firstName, from);

const server = connect(Number(process.env.PORT), process.env.HOST);

const reader = Reader(server);
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.options.id = botID;

bot.telegram.getMe().then(info => Object.assign(bot.options, info));

const send = msg =>
	bot.telegram.sendMessage(tgID, msg, tgOpts);

const playerCount = () =>
	new Promise((resolve, reject) => {
		setTimeout(reject, 3000);
		return reader.once('players_count', count =>
			resolve([
				count.current,
				count.max,
				count.players.split(/\s*,\s*/)
			]));
	});

reader.on('user', msg =>
	send(code(msg.user) + ' ' + escape(msg.text)));

reader.on('self', msg =>
	send(code('* ' + msg.user + ' ' + msg.text)));

reader.on('say', msg =>
	send(code(msg.user + ': ' + msg.text)));

reader.on('join', msg =>
	send(code(msg.user + ' joined the server')));

reader.on('leave', msg =>
	send(code(msg.user + ' left the server')));

reader.on('death', msg =>
	send(code(msg.user + ' ' + msg.text)));

reader.on('advancement', msg =>
	send(
		code(msg.user) +
		' has made the advancement ' +
		code('[' + msg.advancement + ']')));

reader.on('goal', msg =>
	send(
		code(msg.user) +
		' has reached the goal ' +
		code('[' + msg.goal + ']')));

reader.on('challenge', msg =>
	send(
		code(msg.user) +
		' has completed the challenge ' +
		code('[' + msg.challenge + ']')));

if (process.env.KILL_CHICKENS) {
	reader.on('entity', msg =>
		msg.mob === 'chicken' &&
			server.write('kill ' + msg.uuid + '\n'));
}

reader.on('close', () =>
	bot.stop());

bot.command('chatid', ctx =>
	ctx.reply(ctx.chat.id));

bot.command('list', ctx => {
	server.write('list\n');
	return playerCount()
		.then(([ current, max, players ]) => ctx.reply(
			'Players online ' +
			'(' + code(current) + '/' + code(max) + '):\n' +
			code(players.join('\n')), tgOpts))
		.catch(err => {
			if (err) {
				console.error(err);
			}
			return ctx.reply(code('No players online!'), tgOpts);
		});
});

const fromName = R.ifElse(
	fromLastName,
	R.o(
		joinSpace,
		R.converge(
			R.pair,
			[ fromFirstName, fromLastName ])),
	fromFirstName);

const minecraftUsername = R.o(
	R.head,
	splitSpace);

const removeMinecraftUsername = R.compose(
	joinSpace,
	R.tail,
	splitSpace);

const nextArg = R.nthArg(1);

const telegram = R.compose(
	R.not,
	R.equals(botID),
	String,
	fromID);

const fromUser = R.ifElse(
	telegram,
	R.o(fromName, message),
	R.compose(minecraftUsername, text, message));


const captionMedia = (name, fn) => R.ifElse(
	R.compose(R.prop('caption'), fn),
	R.compose(
		R.insert(3, R.__, [
			{ text: '[', color: 'white' },
			{ text: name, color: 'gray' },
			{ text: '] ', color: 'white' }
		]),
		textJSON,
		R.compose(R.prop('caption'), fn)),
	R.always([
		{ text: '[', color: 'white' },
		{ text: name, color: 'gray' },
		{ text: ']', color: 'white' }
	]));

const handler = R.ifElse(
	R.compose(
		R.equals(tgID),
		String,
		chatID,
		message),
	R.compose(
		R.bind(server.write, server),
		// eslint-disable-next-line no-underscore-dangle
		R.concat(R.__, '\n'),
		R.concat('tellraw @a '),
		JSON.stringify,
		R.converge(messageJSON, [
			// telegram
			R.o(telegram, message),
			// from
			fromUser,
			// text
			R.cond([
				[ R.compose(text, message),
					R.compose(text, message) ],
				[ R.compose(R.prop('audio'), message),
					captionMedia('AUDIO', message) ],
				[ R.compose(R.prop('document'), message),
					captionMedia('DOCUMENT', message) ],
				[ R.compose(R.prop('photo'), message),
					captionMedia('IMAGE', message) ],
				[ R.compose(R.prop('sticker'), message),
					captionMedia('STICKER', message) ],
				[ R.compose(R.prop('video'), message),
					captionMedia('VIDEO', message) ],
				[ R.compose(R.prop('voice'), message),
					captionMedia('VOICE', message) ],
				[ R.compose(R.prop('contact'), message),
					captionMedia('CONTACT', message) ],
				[ R.compose(R.prop('location'), message),
					captionMedia('LOCATION', message) ],
				[ R.compose(R.prop('game'), message),
					captionMedia('GAME', message) ],
				[ R.compose(R.prop('video_note'), message),
					captionMedia('VIDEO NOTE', message) ]
			]),
			// hoverType
			R.ifElse(
				R.o(reply, message),
				R.always('Reply'),
				R.always(undefined)),
			// hoverUserTelegram
			R.compose(telegram, reply, message),
			// hoverUser
			R.ifElse(
				R.o(reply, message),
				R.ifElse(
					R.compose(
						R.equals(botID),
						String,
						fromID,
						reply,
						message),
					R.compose(minecraftUsername, text, reply, message),
					R.compose(fromName, reply, message)),
				R.always(undefined)),
			// hoverText
			R.ifElse(
				R.compose(telegram, reply, message),
				R.cond([
					[ R.compose(text, reply, message),
						R.compose(text, reply, message) ],
					[ R.compose(R.prop('audio'), reply, message),
						captionMedia('AUDIO', R.compose(reply, message)) ],
					[ R.compose(R.prop('document'), reply, message),
						captionMedia('DOCUMENT', R.compose(reply, message)) ],
					[ R.compose(R.prop('photo'), reply, message),
						captionMedia('IMAGE', R.compose(reply, message)) ],
					[ R.compose(R.prop('sticker'), reply, message),
						captionMedia('STICKER', R.compose(reply, message)) ],
					[ R.compose(R.prop('video'), reply, message),
						captionMedia('VIDEO', R.compose(reply, message)) ],
					[ R.compose(R.prop('voice'), reply, message),
						captionMedia('VOICE', R.compose(reply, message)) ],
					[ R.compose(R.prop('contact'), reply, message),
						captionMedia('CONTACT', R.compose(reply, message)) ],
					[ R.compose(R.prop('location'), reply, message),
						captionMedia('LOCATION', R.compose(reply, message)) ],
					[ R.compose(R.prop('game'), reply, message),
						captionMedia('GAME', R.compose(reply, message)) ],
					[ R.compose(R.prop('video_note'), reply, message),
						captionMedia('VIDEO NOTE', R.compose(reply, message)) ]
				]),
				R.compose(removeMinecraftUsername, text, reply, message))
		])),
	R.o(
		R.call,
		nextArg));

bot.on([
	'text',
	'audio',
	'document',
	'photo',
	'sticker',
	'video',
	'voice',
	'contact',
	'location',
	'game',
	'video_note'
], handler);

bot.catch(logError);

bot.startPolling();
