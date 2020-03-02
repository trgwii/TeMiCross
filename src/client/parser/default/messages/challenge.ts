import username from '../username';

export default
	'(?<user>' +
		username +
	') has completed the challenge \\[(?<challenge>.+)\\]$';
