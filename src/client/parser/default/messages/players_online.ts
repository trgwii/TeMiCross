import username from '../username';

export default '(?<players>(' + username + ')?(\\s*,\\s*(' + username + '))*)$';
