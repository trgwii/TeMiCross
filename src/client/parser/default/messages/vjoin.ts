import username from '../username';

export default '(?<user>' +
	username +
	') (\\(formerly known as ' +
	username +
	'\\) )?joined the game$';
