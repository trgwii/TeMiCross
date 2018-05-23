'use strict';

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

module.exports = messageJSON;
