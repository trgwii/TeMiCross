import username from '../username';

export default '(?<user>' +
	username +
	') has reached the goal \\[(?<goal>.+)\\]$';
