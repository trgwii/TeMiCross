'use strict';

// eslint-disable-next-line no-underscore-dangle
const __ = require('ramda/src/__');
const append = require('ramda/src/append');
const assoc = require('ramda/src/assoc');
const compose = require('ramda/src/compose');
const concat = require('ramda/src/concat');
const flip = require('ramda/src/flip');
const ifElse = require('ramda/src/ifElse');
const nthArg = require('ramda/src/nthArg');
const of = require('ramda/src/of');
const replace = require('ramda/src/replace');

const textJSON = replace(/\n/g, '\n ');

// eslint-disable-next-line no-unused-vars
const replyTextJSON = compose(
	of,
	concat(__, '\n'),
	concat('\n > '),
	replace(/\n/g, '\n > '));

const userJSON = ifElse(
	nthArg(1),
	compose(
		flip(append)([
			{ text: 'TG', color: 'blue' },
			{ text: ': ', color: 'white' }
		]),
		assoc('text', __, { color: 'white' })),
	of);

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
	textJSON(text)
];

module.exports = messageJSON;
