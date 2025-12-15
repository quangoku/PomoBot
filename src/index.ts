import { MezonClient } from "mezon-sdk";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = new MezonClient({
    botId: process.env.BOT_ID,
    token: process.env.BOT_TOKEN,
  });

  await client.login();

  client.onChannelMessage(async (event) => {
    const channel = await client.channels.fetch(event.channel_id);
    const msg = await channel.messages.fetch(event.message_id!);

    if (event.content.t === "*ping") {
      return msg.reply({ t: "Pong!" }, []);
    } else if (event.content.t?.startsWith("*pomo")) {
      return msg.reply({ t: "start pomo" });
    }
  });

  console.log("Bot đã khởi động!");
}

main().catch(console.error);
