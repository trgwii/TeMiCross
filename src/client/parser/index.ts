import { join } from 'path';
import { readdirSync } from 'fs';
import { Readable } from 'stream';
import { createInterface } from 'readline';
import parse from '../dataparser';

import {
	head,
	map,
	mapObjIndexed
} from 'ramda';

import * as Default from './default';
import * as spigot from './old-spigot';

type servertype = 'default' | 'old-spigot';

const convert = <T>(obj: any): T =>
	typeof obj !== 'object' ? obj :
		obj.default ? obj.default :
			Object.fromEntries(Object.entries(obj)
				.map(([ k, v ]) => [ k, convert(v) ]));

const loadMessages = (type: servertype) =>
	convert<{ prefix: string, messages: Record<string, string> }>(
		({ default: Default, 'old-spigot': spigot })[type]);


const getMessages = (type: servertype) => ({
	// eslint-disable-next-line global-require
	prefix: loadMessages(type).prefix,
	messages: type === 'default'
		? loadMessages(type)
		: {
			...loadMessages('default').messages,
			...loadMessages(type).messages
		}
});

const fixType = (t: any) =>
	[ 'default', 'old-spigot' ].includes(t)
		? t
		: 'default';

const Parser = (type: servertype, stream: Readable) => {
	const { prefix, messages } = getMessages(fixType(type));
	const rl = createInterface({ input: stream });

	const handlers = mapObjIndexed((regexp, file) => ({
		regexp: new RegExp(prefix + regexp),
		type: head(file.split('.'))
	}), messages);

	rl.on('line', line =>
		(map as any)((handler: { regexp: RegExp; type: string }) => {
			const result = handler.regexp.exec(line);
			if (handler.type === 'data') {
				return result && rl.emit(handler.type, {
					...result.groups,
					data: parse(result.groups?.data),
					type: handler.type
				});
			}
			return result && rl.emit(handler.type, {
				...result.groups,
				type: handler.type
			});
		}, handlers));

	return rl;
};

Parser.fixType = fixType;

export default Parser;
