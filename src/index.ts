import client from "./bot/client.js";
import createPomo from "./bot/command/CreatePomo.js";
import { getHelp } from "./bot/command/GetHelp.js";
import { getLeaderBoard } from "./bot/command/GetLeaderBoard.js";
import getProgress from "./bot/command/GetProgress.js";
import { getQuote } from "./bot/command/GetQuote.js";
import { handleCancelPomo } from "./bot/event/HandleCancelPomo.js";
import connectDB from "./db/ConnectDB.js";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

async function main() {
  await client.login();
  await connectDB();
  client.onChannelMessage(async (event) => {
    try {
      if (event.content.t?.startsWith("*pomo")) {
        createPomo(event);
      } else if (event.content.t?.startsWith("*progress")) {
        getProgress(event);
      } else if (event.content.t?.startsWith("*leaderboard")) {
        getLeaderBoard(event);
      } else if (event.content.t?.startsWith("*quote")) {
        getQuote(event);
      } else if (event.content.t?.startsWith("*help")) {
        getHelp(event);
      }
    } catch (error) {
      console.log("Error handling message:", error);
    }
  });
  client.onMessageButtonClicked(async (event) => {
    try {
      if (event.button_id.startsWith("cancel")) {
        handleCancelPomo(event);
      }
    } catch (error) {
      console.log("Error handling button click:", error);
    }
  });
}
main()
  .then(() => console.log("Bot is running"))
  .catch(console.error);

const app = express();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
