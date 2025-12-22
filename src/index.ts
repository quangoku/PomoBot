import client from "./bot/client.ts";
import CreatePomo from "./bot/command/CreatePomo.ts";
import { GetLeaderBoard } from "./bot/command/GetLeaderBoard.ts";
import GetProgress from "./bot/command/GetProgress.ts";
import { handleCancelPomo } from "./bot/event/HandleCancelPomo.ts";
import handleStartPomo from "./bot/event/HandleStartPomo.ts";
import connectDB from "./db/ConnectDB.ts";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await client.login();
  await connectDB();
  client.onChannelMessage(async (event) => {
    if (event.content.t?.startsWith("a")) {
      CreatePomo(event);
    } else if (event.content.t?.startsWith("b")) {
      GetProgress(event);
    } else if (event.content.t?.startsWith("c")) {
      GetLeaderBoard(event);
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
