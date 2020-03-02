import runWrapper from '../wrap/run';
import runBot from '../bot/run';

const run = opts => {
	const { stdin, stdout } = runWrapper(opts);
	const bot = runBot({ ...opts, stdin, stdout });
	return bot;
};

export default run;
