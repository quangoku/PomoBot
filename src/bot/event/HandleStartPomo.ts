import type { IInteractiveMessageProps } from "mezon-sdk";
import type { Message } from "mezon-sdk/dist/cjs/mezon-client/structures/Message.js";
import type { TextChannel } from "mezon-sdk/dist/cjs/mezon-client/structures/TextChannel.js";
import type { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime.js";
import { FIVE_SECS } from "../utils/TIME.ts";

interface Data {
  task: string;
  time_select: string;
}

export default async function handleStartPomo(
  channel: TextChannel,
  event: MessageButtonClicked,
  message: Message
) {
  try {
    if (event.extra_data.includes("[")) {
      throw new Error("invalid input");
    }
    const data: Data = JSON.parse(event.extra_data);
    if (data.task.length === 0) {
      throw new Error("invalid input");
    }
    console.log(data);
    //if success remove the ephemeral message and start a pomodoros , save to db , etc...
    await channel.deleteEphemeral(event.user_id, event.message_id);

    const embedMessage: IInteractiveMessageProps = {
      color: "#ff0000ff",
      title: "⌛YOUR POMODORO",
      author: {
        name: ``,
      },
      fields: [
        {
          name: "📚Task to complete",
          value: `${data.task}`,
          inline: true,
        },
        {
          name: "⏲️Duration ",
          value: `${data.time_select}mins`,
          inline: true,
        },
      ],
      footer: {
        text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
        icon_url: "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
      },
    };
    message.reply({
      t: "",
      embed: [embedMessage],
    });

    setTimeout(() => {
      message.reply({
        t: "times out",
      });
    }, FIVE_SECS);
  } catch (error) {
    message.reply({
      t: "All inputs are required",
    });
  }
}
