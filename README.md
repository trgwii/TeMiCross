# TeMiCross

This is a Minecraft-to-Telegram chat bridge

[To be used with this TCP-wrapper for the server](https://gist.github.com/trgwii/4db704f75b0a701b92cac25cb5164b14)

## Spigot

If you're using spigot, use [the spigot branch](https://github.com/trgwii/TeMiCross/tree/spigot)

## Environment variables

PORT: The TCP-port to connect to

HOST: The TCP-IP to connect to

TELEGRAM_CHAT: The Telegram chat ID to relay messages to / from

TELEGRAM_BOT_TOKEN: The token for the Telegram bot

## Setup: Part 1 (Minecraft server modifications)

1. Install [Node.js](https://nodejs.org/)
1. Navigate to your Minecraft server directory
1. Download [server.js](https://gist.githubusercontent.com/trgwii/4db704f75b0a701b92cac25cb5164b14/raw/539a899285c7bf48500870e968fdb47d1e4701b7/server.js) and place it there
1. Run `npm i iconv-lite`
1.
	* Linux: put the following into a run_minecraft_server.sh file:
	```
	export PORT=12345
	node server
	```

	* Windows: put the following into a run_minecraft_server.bat file:
	```
	@set PORT=12345
	@node server
	```
1. If you need any command-line arguments to the Minecraft server (like `-Xms2G -Xmx4G`), place them after the last line (`node server <args>`)
1. If you need to expose the TCP wrapper on a specific interface (You usually don't) copy the line with `PORT` and replace it with `IP` (Example: `IP=192.168.1.4`)
1. Start the Minecraft server with:
	* Linux: `./run_minecraft_server.sh`
	* Windows: `run_minecraft_server`

## Setup: Part 2 (The Telegram bot bridge)

1. Clone or download this repo into a folder.
1. Run `npm i`
1. Get a bot token from [@BotFather](https://t.me/BotFather)
1.
	* Linux: Create a file run_bot.sh containing the follwing:
	```
	# Enter the Telegram Chat ID you want to
	# bridge the Minecraft server to:
	# (remember it starts with "-" for supergroups)
	TELEGRAM_CHAT=

	# Enter the Telegram bot token you
	# got from @BotFather
	TELEGRAM_BOT_TOKEN=

	# Enter the same PORT value you
	# entered in Setup Part 1:
	# (Probably 12345)
	PORT=

	# If you entered an IP in Part 1,
	# enter an IP or hostname that
	# reaches that port here
	# (Or enter 127.0.0.1 if both
	# are running on the same machine)
	HOST=

	export TELEGRAM_CHAT TELEGRAM_BOT_TOKEN PORT HOST

	node .
	```
	* Windows: Create a file run_bot.bat containing the following:
	```
	@rem Enter the Telegram Chat ID you want to
	@rem bridge the Minecraft server to:
	@rem (remember it starts with "-" for supergroups)
	@set TELEGRAM_CHAT=

	@rem Enter the Telegram bot token you
	@rem got from @BotFather
	@set TELEGRAM_BOT_TOKEN=

	@rem Enter the same PORT value you
	@rem entered in Setup Part 1:
	@rem (Probably 12345)
	@set PORT=

	@rem If you entered an IP in Part 1,
	@rem enter an IP or hostname that
	@rem reaches that port here
	@rem (Or enter 127.0.0.1 if both
	@rem are running on the same machine)
	@set HOST=

	@node .
	```
1. Fill in all the neccessary values (Look at the comments above)
1. Start the bridge (make sure the Minecraft server is started first) with:
	* Linux: `./run_bot.sh`
	* Windows: `run_bot`
1. Test it in-game and from your Telegram-chat to make sure it works!
1. Report any bugs you find on the Issues page here!
