import { type ChannelMessage, type IInteractiveMessageProps } from "mezon-sdk";
import client from "../client.ts";
import Task from "../../db/models/task.model.ts";
export default async function GetProgess(event: ChannelMessage) {
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id!);

  const task = await Task.find({
    userId: message.sender_id,
    isCompleted: true,
  });

  const totalFocusTime = task.reduce(
    (acc, curr) => acc + Number(curr.duration),
    0
  );

  const embedMessage: IInteractiveMessageProps = {
    color: "#19bf13ff",
    title: "***YOUR PROGRESS***",
    author: {
      name: `📈Progress : ${event.username}`,
    },
    fields: [
      {
        name: "📚 Total  Task  completed",
        value: `${task.length}`,
        inline: true,
      },
      {
        name: "⏲️Total focus time",
        value: totalFocusTime + "minutes",
        inline: true,
      },
    ],
    footer: {
      text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
      icon_url: "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
    },
  };
  await message.reply({
    t: "",
    embed: [embedMessage],
  });
}
