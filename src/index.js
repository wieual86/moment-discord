import { config } from "dotenv";
import Discord from "discord.js";
import { evaluate, randomInt } from "mathjs";

// Get env
config();

// start up bot
const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}.`);
});

// handle messages
client.on("message", message => {
  const params = getParams(message);
  if (!params.dice) return;
  const response = getResult(params, message.author.id);
  if (message.channel.type === "dm") message.author.send(response);
  else message.channel.send(response);
});

const getParams = message => {
  const text = message.content.replace(/\s+/g, "").replace(/\n+/g, "").toLowerCase();
  const match = text.match(/.*\.(?:roll|r)(\d+(?:[+-]\d+)*)(!?)(initiative|i)?(\d+(?:[+-]\d+)*)?/);
  if (!match) return {};
  return {
    dice: parseInt(evaluate(match[1] || 0)),
    expertise: !!match[2],
    initiative: !!match[3],
    baseInitiative: parseInt(evaluate(match[4] || 0))
  };
};

const getResult = (params, userId) => {
  const results = [];
  for (let i = 0; i < params.dice; ++i) {
    results.push(rollDie());
    if (params.expertise) {
      while (results[results.length - 1] === 6) results.push(rollDie());
    }
  }
  results.sort((a, b) => b - a);
  const success = results.reduce((sum, item) => (item >= 5 ? sum + 1 : sum), 0);
  if (!params.initiative) {
    return `<@${userId}> got a total success of ${success} (${results.join(", ")}).`;
  }
  return `<@${userId}> got an initiative of ${success + params.baseInitiative} (${results.join(
    ", "
  )}; +${params.baseInitiative} base).`;
};

const rollDie = () => 1 + randomInt(0, 6);
