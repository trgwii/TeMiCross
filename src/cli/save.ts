import { writeFileSync } from 'fs';

const save = <T>(name: string, data: T): T => {
	writeFileSync(`${name}.json`, JSON.stringify(data, null, '\t'));
	return data;
};

export default save;
