import { EventEmitter } from 'events';
import axios, { AxiosResponse } from 'axios';

type Latest = {
	release: string;
	snapshot: string;
};

const getVersion = (type: keyof Latest = 'release'): Promise<string> =>
	axios('https://launchermeta.mojang.com/mc/game/version_manifest.json')
		.then<string>((x: AxiosResponse<{ latest: Latest }>) => x.data.latest[type]);

const emitUpdates = (type: keyof Latest = 'release', init = false): EventEmitter => {
	let version = '';
	let stop = false;
	const e: EventEmitter & { stop: () => void } =
	Object.assign(new EventEmitter(), {
		stop: (): void => {
			stop = true;
		}
	});
	const check = (v: string): void => {
		if ((version !== '' || init) && version !== v) {
			e.emit('update', v);
		}
		version = v;
		if (!stop) {
			setTimeout(() => {
				getVersion(type).then(check);
			}, 10000);
		}
	};
	getVersion(type).then(check);
	return e;
};

export default emitUpdates;
