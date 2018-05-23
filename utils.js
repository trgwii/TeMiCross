'use strict';

const __ = require('ramda/src/__'); // eslint-disable-line no-underscore-dangle
const compose = require('ramda/src/compose');
const concat = require('ramda/src/concat');
const flip = require('ramda/src/flip');
const replace = require('ramda/src/replace');
const tap = require('ramda/src/tap');

const fs = require('fs');
const readFileSync = flip(fs.readFileSync);

const load = compose(
	JSON.parse,
	readFileSync('utf8'));

const escape = compose(
	replace(/>/g, '&gt;'),
	replace(/</g, '&lt;'),
	replace(/&/g, '&amp;'));

const code = compose(
	concat(__, '</code>'),
	concat('<code>'),
	escape);

const name = user => user.first_name;

const userJSON = (name, telegram) =>
	telegram
		? [
			{ text: 'TG', color: 'blue' },
			{ text: ': ', color: 'white' },
			{ text: name, color: 'white' }
		]
		: [ name ];

const replyUserJSON = (name, telegram, text) => [
	' (',
	{
		text: 'Reply',
		color: 'yellow',
		hoverEvent: {
			action: 'show_text',
			value: [
				{ text: '<', color: 'white' },
				...userJSON(name, telegram),
				{ text: '> ' + text, color: 'white' }
			]
		}
	},
	')'
];

const textJSON = text => [
	text.replace(/\n/g, '\n ')
];

const replyTextJSON = text => [
	'\n > ' + text.replace(/\n/g, '\n > ') + '\n'
];

const fromJSON = (name, telegram, reply) => [
	'<',
	...userJSON(name, telegram),
	...reply || [],
	'> '
];


const messageJSON = (telegram, from, text,
	replyUserTelegram, replyUser, replyText) => [
	...fromJSON(from, telegram,
		replyUser
			? replyUserJSON(replyUser, replyUserTelegram, replyText)
			: undefined),
	// ...replyText ? replyTextJSON(replyText) : [],
	...textJSON(text)
];

const log = tap(console.log);

module.exports = {
	code,
	escape,
	load,
	log,
	messageJSON,
	name
};
