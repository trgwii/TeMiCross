"use strict";

const username = require("../username");

module.exports =
  "(?<user>" +
  username +
  ") (?<text>" +
  "was (" +
  "shot by .+|" +
  "shot off (some vines|a ladder) by .+|" +
  "pricked to death|" +
  "stabbed to death|" +
  "squished too much|" +
  "blown up by .+|" +
  "killed by .+|" +
  "doomed to fall by .+|" +
  "blown from a high place by .+|" +
  "squashed by .+|" +
  "burnt to a crisp whilst fighting .+|" +
  "roasted in dragon breath( by .+)?|" +
  "struck by lightning( whilst fighting .+)?|" +
  "slain by .+|" +
  "fireballed by .+|" +
  "killed trying to hurt .+|" +
  "impaled by .+|" +
  "speared by .+|" +
  "poked to death by a sweet berry bush( whilst trying to escape .+)?|" +
  "pummeled by .+" +
  ")|" +
  "hugged a cactus|" +
  "walked into a cactus whilst trying to escape .+|" +
  "drowned( whilst trying to escape .+)?|" +
  "suffocated in a wall( whilst fighting .+)?|" +
  "experienced kinetic energy( whilst trying to escape .+)?|" +
  "removed an elytra while flying( whilst trying to escape .+)?|" +
  "blew up|" +
  "hit the ground too hard( whilst trying to escape .+)?|" +
  "went up in flames|" +
  "burned to death|" +
  "walked into fire whilst fighting .+|" +
  "went off with a bang( whilst fighting .+)?|" +
  "tried to swim in lava(( while trying)? to escape .+)?|" +
  "discovered floor was lava|" +
  "walked into danger zone due to .+|" +
  "got finished off by .+|" +
  "starved to death|" +
  "didn't want to live in the same world as .+|" +
  "withered away( whilst fighting .+)?|" +
  "died( because of .+)?|" +
  "fell (" +
  "from a high place( and fell out of the world)?|" +
  "off a ladder|" +
  "off to death( whilst fighting .+)?|" +
  "off some vines|" +
  "out of the water|" +
  "into a patch of fire|" +
  "into a patch of cacti|" +
  "too far and was finished by .+|" +
  "out of the world" +
  ")" +
  ")$";
