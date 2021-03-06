import { config } from "dotenv";
import Discord from "discord.js";
import { evaluate, randomInt } from "mathjs";

// set up restrictions
const maxDice = 100;

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
  if (!params) return;

  const user = `<@${message.author.id}>`;
  let response;

  if (params.error) response = `${user}, your expression could not be processed.`;
  else if (params.dice > maxDice) response = `${user}, the dice total cannot exceed ${maxDice}.`;
  else if (params.dice <= 0) response = `${user}, your character automatically fails the action.`;
  else response = getResult(params, user);

  if (message.channel.type === "dm") message.author.send(response);
  else message.channel.send(response);
});

const getParams = message => {
  try {
    const text = message.content.replace(/\s+/g, "").replace(/\n+/g, "").toLowerCase();
    const diceMatch = text.match(/.*\.(?:roll|r)([^\w!]*\d+(?:[^\w!]+\d+)*[^\w!]*)/);
    if (!diceMatch) return null;

    const expertiseMatch = text.match(/.*\.(?:roll|r).*(expertise|[^v]e|!)/);
    const burstMatch = text.match(/.*\.(?:roll|r).*(burst|b)/);
    const initiativeMatch = text.match(
      /.*\.(?:roll|r).*(?:initiative|i)([^\w!]*\d+(?:[^\w!]+\d+)*[^\w!]*)?/
    );

    return {
      dice: parseInt(evaluate(diceMatch[1] || 0)) + (burstMatch ? 3 : 0),
      expertise: !!expertiseMatch,
      initiative: !!initiativeMatch,
      baseInitiative: parseInt(evaluate((initiativeMatch && initiativeMatch[1]) || 0))
    };
  } catch (error) {
    return { error: true };
  }
};

const getResult = (params, user) => {
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
    return `${user}, you got a total success of **${success}** (${results.join(", ")}).`;
  }
  return `${user}, you got an initiative of **${success + params.baseInitiative}** (${results.join(
    ", "
  )}; ${params.baseInitiative} base).`;
};

const rollDie = () => 1 + randomInt(0, 6);
