import {
  type IMessageActionRow,
  type IInteractiveMessageProps,
  type SelectComponent,
  type InputComponent,
  type ButtonComponent,
  type ChannelMessage,
  type ChannelMessageContent,
} from "mezon-sdk";
import { createButton } from "../components/Button.ts";
import { createSelect } from "../components/Select.ts";
import { createInput } from "../components/Input.ts";
import { createActionRow } from "../components/ActionRow.ts";
import { sendEphemeral } from "../message/Message.ts";
import handleStartPomo from "../event/HandleStartPomo.ts";
import { randomUUID } from "node:crypto";
import client from "../client.ts";
export default async function createPomo(event: ChannelMessage) {
  // get channel and message
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id!);
  //gen buttonId random to not conflict with other button
  const buttonId = randomUUID();
  const cancelId = randomUUID();
  // create ui component
  const button: ButtonComponent = createButton(buttonId, "start", 3);
  const cancel: ButtonComponent = createButton(cancelId, "cancel", 4);
  const timeSelect: SelectComponent = createSelect("time_select", "", [
    { label: "15mins", value: "15" },
    { label: "30mins", value: "30" },
    { label: "60mins", value: "60" },
  ]);
  const taskInput: InputComponent = createInput("task", "Task to complete");
  const actionRow1: IMessageActionRow = createActionRow([cancel, button]);

  const embedMessage: IInteractiveMessageProps = {
    color: "#ff0000ff",
    title: "⌛ START YOUR POMODORO",
    author: {
      name: `Created by : ${event.username}`,
    },
    fields: [
      {
        name: "📚 Set a Task to complete",
        value: "",
        inline: false,
        inputs: taskInput,
      },
      {
        name: "⏲️ Set your time",
        value: "",
        inline: false,
        inputs: timeSelect,
      },
    ],
    footer: {
      text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
      icon_url: "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
    },
  };

  const content: ChannelMessageContent = {
    t: "",
    components: [actionRow1],
    embed: [embedMessage],
  };

  await sendEphemeral(channel, message.sender_id, content);

  client.onMessageButtonClicked(async (event) => {
    if (event.button_id === buttonId) {
      handleStartPomo(channel, event, message);
    } else if (event.button_id === cancelId) {
      await channel.updateEphemeral(
        event.user_id,
        { t: "updated" },
        event.message_id
      );
    }
  });
}
