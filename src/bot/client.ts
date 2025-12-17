import { MezonClient } from "mezon-sdk";
import dotenv from "dotenv";
dotenv.config();

const client = new MezonClient({
  botId: process.env.BOT_ID,
  token: process.env.BOT_TOKEN,
});
export default client;
