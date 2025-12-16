import {
  MezonClient,
  type IMessageActionRow,
  type IInteractiveMessageProps,
  type SelectComponent,
  type InputComponent,
  type ButtonComponent,
  type ChannelMessage,
} from "mezon-sdk";
import { createButton } from "../components/Button.ts";
import { createSelect } from "../components/Select.ts";
import { createInput } from "../components/Input.ts";
import { createActionRow } from "../components/ActionRow.ts";
import { replyWithExtras } from "../message/Message.ts";

export default async function handleStartPomo(
  client: MezonClient,
  event: ChannelMessage
) {
  // get channel and message
  const channel = await client.channels.fetch(event.channel_id);
  const msg = await channel.messages.fetch(event.message_id!);
  // create ui component
  const button: ButtonComponent = createButton("start_button", "start", 3);
  const timeSelect: SelectComponent = createSelect("time_select", "", [
    { label: "15mins", value: "15" },
    { label: "30mins", value: "30" },
    { label: "60mins", value: "60" },
  ]);
  const taskInput: InputComponent = createInput("input", "Task to complete");
  const actionRow1: IMessageActionRow = createActionRow([button]);

  const messageProps: IInteractiveMessageProps = {
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
      text: "Pomodoro: Focus 100% | Created by HOTBOT",
      icon_url: "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
    },
  };

  return replyWithExtras(msg, "", [actionRow1], [messageProps]);
}
