import type { ChannelMessage } from "mezon-sdk";
import { getRandomQuote } from "../utils/Quote.ts";
import client from "../client.ts";
import type { IInteractiveMessageProps } from "mezon-sdk";

export async function getQuote(event: ChannelMessage) {
  const quote = getRandomQuote();
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id!);

  const parts = quote.split("-");
  const quoteText = parts[0];
  const author = parts[1] || "Unknown";

  const embedMessage: IInteractiveMessageProps = {
    color: "#2ecc71", // Màu xanh lá tươi tắn hơn
    title: "✨ Inspiration For You",
    description: `*"${quoteText}"*\n-- ${author} --`,
    fields: [
      {
        name: " ",
        value: "",
        inline: false,
      },
    ],
    footer: {
      text: "Keep growing every day • PomoBOT",
      icon_url: "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
    },
    timestamp: new Date().toISOString(),
  };

  await message.reply({
    t: "",
    embed: [embedMessage],
  });
}
