import { Client, Events, GatewayIntentBits } from "discord.js";
import { listCommonRadicals } from "./bushu.ts";


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


client.once(Events.ClientReady, (readyClient) => {
  console.log(`準備完了！ ${readyClient.user.tag} としてログインしました。`);
});


client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const common = Array.from(listCommonRadicals(message.content));

  if (common.length > 0) {
    for (const { submatch, commonRadical } of common) {
      if (['昨日', '明日', '思想'].includes(submatch)) {
        continue;
      }

      await message.reply(`ナイス共通部首！ ${submatch}（${commonRadical}）`);
    }
  }
});


client.login(process.env.DISCORD_TOKEN);
