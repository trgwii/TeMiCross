'use strict';

const { join } = require('path');
const { readdirSync } = require('fs');
const { createInterface } = require('readline');

const head = require('ramda/src/head');
const mapObjIndexed = require('ramda/src/mapObjIndexed');

const prefix = require('./regexps/prefix');
const messages = readdirSync('./regexps/messages')
	.reduce((result, file) => ({
		...result,
		// eslint-disable-next-line global-require
		[file]: require(join('./regexps/messages', file))
	}));

const Reader = stream => {
	const rl = createInterface({ input: stream });

	const handlers = mapObjIndexed((regexp, file) => ({
		regexp: new RegExp(prefix + regexp),
		type: head(file.split('.'))
	}), messages);

	rl.on('line', line =>
		handlers.forEach(handler => {
			const result = handler.regexp.exec(line);
			return result && rl.emit(handler.type, {
				...result.groups,
				type: handler.type
			});
		}));

	return rl;
};

module.exports = Reader;
