const r = require;

import { resolve } from 'path';

const load = <T>(name: string): T | null => {
	try {
		return r(resolve(`${name}.json`));
	} catch (err) {
		if (err.code === 'MODULE_NOT_FOUND') {
			return null;
		}
		throw err;
	}
};

export default load;
