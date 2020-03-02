import username from '../username';

export default
	'(?<user>' +
		username +
	'|.+?) has the following entity data: (?<data>.+)$';
