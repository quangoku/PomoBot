import client from "./bot/client.js";
import createPomo from "./bot/command/CreatePomo.js";
import { getLeaderBoard } from "./bot/command/GetLeaderBoard.js";
import getProgress from "./bot/command/GetProgress.js";
import { getQuote } from "./bot/command/GetQuote.js";
import { handleCancelPomo } from "./bot/event/HandleCancelPomo.js";
import connectDB from "./db/ConnectDB.js";
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
