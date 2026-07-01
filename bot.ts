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
    const reactionEmoji = message.guild?.emojis.cache.find((emoji) => emoji.name === 'kyoutsuu_bushu');
    message.react(reactionEmoji || '👍').catch(console.error);
  }

  if ('name' in message.channel && message.channel.name === '雑談') {
    const filtered = common.filter(({ submatch }) => !['昨日', '明日', '日時', '思想'].includes(submatch));

    if (filtered.length > 0) {
      const text = filtered
        .map(({ submatch, commonRadical }) => `${submatch}（${commonRadical}部）`)
        .join('、');

      await message.reply(`ナイス共通部首！ ${text}`);
    }
  }
});


client.login(process.env.DISCORD_TOKEN);
