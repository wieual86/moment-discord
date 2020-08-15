import { config } from "dotenv";
import Discord from "discord.js";

// Get env
config();

// start up bot
const bot = new Discord.Client();
bot.login(process.env.TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}.`);
});

// handle messages
bot.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
    msg.channel.send("pong");
  } else if (msg.content.startsWith("!kick")) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply("Please tag a valid user!");
    }
  }
});
