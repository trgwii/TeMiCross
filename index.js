'use strict';

const { connect } = require('net');

const Telegraf = require('telegraf');

const Reader = require('./minecraft/outputparser');

const messageJSON = require('./minecraft/messageJSON');

const {
	code,
	escape
} = require('./utils');

const tgID = process.env.TELEGRAM_CHAT;
const tgOpts = { parse_mode: 'HTML' };

const server = connect(Number(process.env.PORT), process.env.HOST);

const reader = Reader(server);
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

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

const first = x => x && x[0];

bot.on('text', ctx =>
	String(ctx.chat.id) === tgID && server.write(
		'tellraw @a ' + JSON.stringify(messageJSON(
			ctx.from.id !== bot.options.id,
			ctx.from.id === bot.options.id
				? first(ctx.message.text.match(/^\w+/))
				: ctx.from.first_name,
			ctx.message.text,
			ctx.message.reply_to_message &&
				ctx.message.reply_to_message.text &&
				ctx.message.reply_to_message.from.id !== bot.options.id,
			ctx.message.reply_to_message &&
				ctx.message.reply_to_message.text &&
				ctx.message.reply_to_message.from.id !== bot.options.id
				? ctx.message.reply_to_message.from.first_name
				: ctx.message.reply_to_message
					? first((ctx.message.reply_to_message.text || '')
						.match(/^\w+/))
					: undefined,
			ctx.message.reply_to_message &&
				ctx.message.reply_to_message.text &&
				ctx.message.reply_to_message.from.id !== bot.options.id
				? ctx.message.reply_to_message.text
				: ctx.message.reply_to_message
					? (ctx.message.reply_to_message.text || '')
						.split(' ')
						.slice(1)
						.join(' ')
					: undefined
		)) + '\n'));

bot.catch(err =>
	console.error(err.name + ': ' + err.message + '\n' + err.stack));

bot.startPolling();
