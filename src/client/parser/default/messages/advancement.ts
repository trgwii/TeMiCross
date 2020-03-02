import username from '../username';

export default
	'(?<user>' +
		username +
	') has made the advancement \\[(?<advancement>.+)\\]$';
