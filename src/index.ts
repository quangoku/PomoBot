import client from "./bot/client.ts";
import CreatePomo from "./bot/command/CreatePomo.ts";
import connectDB from "./db/ConnectDB.ts";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await client.login();
  await connectDB();
  client.onChannelMessage(async (event) => {
    if (event.content.t?.startsWith("a")) {
      CreatePomo(event);
    }
  });
}
main()
  .then(() => console.log("Bot is running"))
  .catch(console.error);
