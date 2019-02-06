'use strict';

const compose = require('ramda/src/compose');
const invertObj = require('ramda/src/invertObj');
const join = require('ramda/src/join');
const last = require('ramda/src/last');
const slice = require('ramda/src/slice');
const split = require('ramda/src/split');
const tail = require('ramda/src/tail');

const load = require('../cli/load');
const save = require('../cli/save');

const Pin = compose(
	slice(0, 4),
	last,
	split('.'),
	String,
	Math.random);

const limitPlayer = (client, user) => {
	client.send(`gamemode adventure ${user}`);
	client.send(`effect give ${user} minecraft:blindness 1000000`);
	client.send(`effect give ${user} minecraft:slowness 1000000 255`);
};

const unlimitPlayer = (client, user) => {
	client.send(`gamemode survival ${user}`);
	client.send(`effect clear ${user} minecraft:blindness`);
	client.send(`effect clear ${user} minecraft:slowness`);
};

const LocalAuth = (bot, client) => {

	const players = {};
	const linked = load('auth') || {};
	const pins = {};

	setInterval(() => {
		Object.entries(players).forEach(([ user, x ]) => {
			if (!x.authed && !x.limited) {
				limitPlayer(client, user);
				x.limited = true;
			}
		});
	}, 500);

	client.on('join', ({ user }) => {
		players[user] = { authed: false };
		bot.telegram.sendMessage(
			linked[user],
			'Type /auth to authenticate yourself');
	});

	client.on('leave', ({ user }) => {
		delete players[user];
	});

	client.on('user', ({ user, text }) => {
		console.log(user, text);
		if (text.startsWith('!')) {
			const [ command, ...args ] = split(/\s+/, text.slice(1));
			if (command === 'link') {
				const [ pin ] = args;
				if (pins[pin]) {
					linked[user] = pins[pin];
					save('auth', linked);
					(players[user] || {}).authed = true;
					unlimitPlayer(client, user);
				}
			}
		}
	});

	bot.command('auth', ctx => {
		const user = invertObj(linked)[ctx.from.id];
		if (user) {
			if (players[user]) {
				players[user].authed = true;
				unlimitPlayer(client, user);
				return ctx.reply('You\'ve successfully authenticated yourself');
			}
			return ctx.reply('Log into the server first!');
		}
		return ctx.reply('Use /link first!');
	});

	bot.command('link', ctx => {
		if (ctx.message.chat.type !== 'private') {
			return ctx.reply('Please use PM');
		}
		const pin = Pin();
		pins[pin] = ctx.from.id;
		return ctx.reply(
			`Type \`!link ${pin}\` (without quotes) in Minecraft after logging in!`,
			{ parse_mode: 'Markdown' });
	});
};

module.exports = LocalAuth;
