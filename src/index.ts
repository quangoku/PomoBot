import client from "./bot/client.ts";
import createPomo from "./bot/command/CreatePomo.ts";
import { getLeaderBoard } from "./bot/command/GetLeaderBoard.ts";
import getProgress from "./bot/command/GetProgress.ts";
import { getQuote } from "./bot/command/GetQuote.ts";
import { handleCancelPomo } from "./bot/event/HandleCancelPomo.ts";
import connectDB from "./db/ConnectDB.ts";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await client.login();
  await connectDB();
  client.onChannelMessage(async (event) => {
    if (event.content.t?.startsWith("a")) {
      createPomo(event);
    } else if (event.content.t?.startsWith("b")) {
      getProgress(event);
    } else if (event.content.t?.startsWith("c")) {
      getLeaderBoard(event);
    } else if (event.content.t?.startsWith("d")) {
      getQuote(event);
    }
  });
  client.onMessageButtonClicked(async (event) => {
    if (event.button_id.startsWith("cancel")) {
      handleCancelPomo(event);
    }
  });
}
main()
  .then(() => console.log("Bot is running"))
  .catch(console.error);
