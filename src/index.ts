import { MezonClient } from "mezon-sdk";
import dotenv from "dotenv";
import CreatePomo from "./bot/command/CreatePomo.ts";
dotenv.config();
//main thread of the bot
async function main() {
  //init client
  const client = new MezonClient({
    botId: process.env.BOT_ID,
    token: process.env.BOT_TOKEN,
  });
  await client.login();
  client.onChannelMessage(async (event) => {
    if (event.content.t?.startsWith("a")) {
      CreatePomo(client, event);
    }
  });
}
main()
  .then(() => console.log("Bot is running"))
  .catch(console.error);
