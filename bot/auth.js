"use strict";

const { compose, invertObj, last, slice, split } = require("ramda");

const load = require("../cli/load");
const save = require("../cli/save");

const Pin = compose(slice(0, 4), last, split("."), String, Math.random);

const gamemodes = ["survival", "creative", "adventure", "survival"];

const limitPlayer = (client, user, player, timeout = 300000) => {
  const gamemodeListener = ({ user: u, data }) => {
    if (u === user && !Number.isNaN(data)) {
      player.gamemode = gamemodes[data];
      client.removeListener("data", gamemodeListener);
    }
  };
  const dimensionListener = ({ user: u, data }) => {
    if (u === user && typeof data === "string") {
      player.dimension = data;
      client.removeListener("data", dimensionListener);
    }
  };
  const positionListener = ({ user: u, data }) => {
    if (u === user && Array.isArray(data)) {
      player.position = data;
      client.removeListener("data", positionListener);
    }
  };

  player.kickTimeout = setTimeout(() => client.send(`kick ${user}`), timeout);
  player.positionInterval = setInterval(
    () =>
      player.position &&
      client.send(
        `execute in ${player.dimension} run tp ${user} ${player.position.join(
          " "
        )}`
      ),
    400
  );

  client.on("data", gamemodeListener);
  client.on("data", positionListener);
  client.on("data", dimensionListener);
  client.send(`data get entity ${user} playerGameType`);
  client.send(`data get entity ${user} Pos`);
  client.send(`data get entity ${user} Dimension`);
  client.send(`effect give ${user} minecraft:blindness 1000000`);
  client.send(`effect give ${user} minecraft:slowness 1000000 255`);
  client.send(`gamemode spectator ${user}`);
};

const unlimitPlayer = (client, user, player, left = false) => {
  clearTimeout(player.kickTimeout);
  clearInterval(player.positionInterval);
  if (!left) {
    client.send(`gamemode ${player.gamemode} ${user}`);
    client.send(`effect clear ${user} minecraft:blindness`);
    client.send(`effect clear ${user} minecraft:slowness`);
  }
};

const LocalAuth = (bot, client) => {
  const players = {};
  const linked = load("auth") || {};
  const pins = {};

  client.on("join", ({ user }) => {
    const player = players[user];
    if (player) {
      unlimitPlayer(client, user, player);
      delete players[user];
    }
    limitPlayer(client, user, (players[user] = {}));
    if (linked[user]) {
      bot.telegram.sendMessage(
        linked[user],
        "Type /auth to authenticate yourself"
      );
    }
  });

  client.on("leave", ({ user }) => {
    const player = players[user];
    if (player) {
      unlimitPlayer(client, user, player, true);
    }
  });

  client.on("user", ({ user, text }) => {
    if (text.startsWith("!")) {
      const [command, ...args] = split(/\s+/, text.slice(1));
      if (command === "link") {
        const [pin] = args;
        if (pins[pin]) {
          if (linked[user]) {
            client.send(
              `tellraw ${user} "This Minecraft account is already in use by another Telegram user!"`
            );
            setTimeout(() => client.send(`kick ${user}`), 2000);
            if (players[user]) {
              unlimitPlayer(client, user, players[user], true);
            }
            return;
          }
          linked[user] = pins[pin];
          save("auth", linked);
          const player = players[user];
          if (player) {
            unlimitPlayer(client, user, player);
            client.send(
              `tellraw ${user} "Successfully linked with Telegram account!"`
            );
          }
        }
      }
    }
  });

  bot.command("auth", (ctx) => {
    const user = invertObj(linked)[ctx.from.id];
    if (user) {
      const player = players[user];
      if (player) {
        unlimitPlayer(client, user, player);
        return ctx.reply("You've successfully authenticated yourself");
      }
      return ctx.reply("Log into the server first!");
    }
    return ctx.reply("Use /link first!");
  });

  bot.command("deauth", (ctx) => {
    const user = invertObj(linked)[ctx.from.id];
    if (user) {
      const player = players[user];
      if (player) {
        unlimitPlayer(client, user, player);
        delete players[user];
      }
      limitPlayer(client, user, (players[user] = {}), 30000);
      return ctx.reply("Deauthed yourself!");
    }
    return ctx.reply("Could not find you, did you /link ?");
  });

  bot.command("link", (ctx) => {
    if (ctx.message.chat.type !== "private") {
      return ctx.reply("Please use PM");
    }
    const pin = Pin();
    pins[pin] = ctx.from.id;
    return ctx.reply(`Type \`!link ${pin}\` in Minecraft after logging in!`, {
      parse_mode: "Markdown",
    });
  });
};

module.exports = LocalAuth;
