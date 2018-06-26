'use strict';

const { connect } = require('net');

const R = require('ramda');
const Telegraf = require('telegraf');

const Reader = require('./minecraft/outputparser');

const messageJSON = require('./minecraft/messageJSON');

const {
	code,
	escape,
	logError
} = require('./utils');

const tgID = process.env.TELEGRAM_CHAT;
const botID = process.env.TELEGRAM_BOT_ID;
const tgOpts = { parse_mode: 'HTML' };

const server = connect(Number(process.env.PORT), process.env.HOST);

const reader = Reader(server);
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.options.id = botID;

bot.telegram.getMe().then(info => Object.assign(bot.options, info));

process.stdin.pipe(server);
server.pipe(process.stdout);

const send = msg =>
	bot.telegram.sendMessage(tgID, msg, tgOpts);

const playerCount = () =>
	new Promise((resolve, reject) => {
		setTimeout(reject, 3000);
		return reader.once('players_count', count =>
			resolve([ count.current, count.max ]));
	});

const playersOnline = () =>
	new Promise((resolve, reject) => {
		setTimeout(reject, 3000);
		return reader.once('players_online', players =>
			resolve(players.players.split(/\s*,\s*/)));
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

reader.on('entity', msg =>
	msg.mob === 'chicken' &&
		server.write('kill ' + msg.uuid + '\n'));

reader.on('close', () =>
	bot.stop());

bot.command('chatid', ctx =>
	ctx.reply(ctx.chat.id));

bot.command('list', ctx => {
	const count = playerCount();
	const online = playersOnline();
	server.write('list\n');
	return Promise.all([
		count,
		online
	])
		.then(([ [ current, max ], players ]) => ctx.reply(
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

/* eslint-disable no-nested-ternary */

const id = R.prop('id');
const chat = R.prop('chat');
const from = R.prop('from');
const text = R.prop('text');
const message = R.prop('message');
const lastName = R.prop('last_name');
const firstName = R.prop('first_name');
const reply = R.prop('reply_to_message');

const chatID = R.o(id, chat);
const fromID = R.o(id, from);
const fromLastName = R.o(lastName, from);
const fromFirstName = R.o(firstName, from);

const fromName = R.ifElse(
	fromLastName,
	R.compose(
		R.join(' '),
		R.converge(
			R.pair,
			[ fromFirstName, fromLastName ])),
	fromFirstName);

const removeMinecraftName = R.compose(
	R.join(' '),
	R.tail,
	R.split(' '));

const nextArg = R.nthArg(1);

const telegram = R.compose(
	R.not,
	R.equals(botID),
	fromID,
	message);

const fromUser = R.ifElse(
	telegram,
	R.compose(fromName, message),
	R.compose(removeMinecraftName, text, message));

const handler = R.ifElse(
	R.compose(
		R.equals(tgID),
		String,
		chatID,
		message),
	R.compose(
		R.bind(server.write, server),
		R.concat(R.__, '\n'),
		R.concat('tellraw @a '),
		JSON.stringify,
		R.converge(messageJSON, [
			telegram,
			fromUser,
			R.compose(text, message),
			R.ifElse(
				R.compose(reply, message),
				R.always('Reply'),
				R.F),
			R.compose(telegram, reply, message),
			R.ifElse(
				R.compose(reply, message),
				R.compose(fromName, reply, message),
				R.compose(removeMinecraftName, text, reply, message)),
			R.compose(text, reply, message)
		])),
	R.compose(
		R.call,
		nextArg));

bot.on(
	[ 'message', 'edited_message' ],
	handler);

bot.on(
	[ 'message', 'edited_message' ],
	() => console.log('bottom'));

bot.catch(logError);

bot.startPolling();
