import initBot from "./bot/index.ts";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "hello 世界" });
});

app.listen(3000, async () => {
  await initBot();
  console.log("app running at 3000");
});
