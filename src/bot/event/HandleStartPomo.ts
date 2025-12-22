import type { ButtonComponent, IInteractiveMessageProps } from "mezon-sdk";
import type { Message } from "mezon-sdk/dist/cjs/mezon-client/structures/Message.js";
import type { TextChannel } from "mezon-sdk/dist/cjs/mezon-client/structures/TextChannel.js";
import type { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime.js";
import User from "../../db/models/user.model.ts";
import client from "../client.ts";
import Task from "../../db/models/task.model.ts";
import { randomUUID } from "node:crypto";
import { createButton } from "../components/Button.ts";
import { createActionRow } from "../components/ActionRow.ts";
import { getRandomReminder } from "../utils/Reminder.ts";

interface Data {
  task: string;
  time_select: string;
}

export default async function handleStartPomo(
  event: MessageButtonClicked,
  message: Message
) {
  const channel = await client.channels.fetch(event.channel_id);

  try {
    if (event.extra_data.includes("[")) {
      throw new Error("invalid input");
    }
    const data: Data = JSON.parse(event.extra_data);
    if (data.task.length === 0) {
      throw new Error("invalid input");
    }
    //if success remove the ephemeral message and start a pomodoros , save to db , etc...
    await channel.deleteEphemeral(event.user_id, event.message_id);
    const Reminder = getRandomReminder();
    //create message to inform user that pomodoro has started
    const embedMessage: IInteractiveMessageProps = {
      color: "#000000ff",
      title: "⌛TIME TO FOCUS",
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
        {
          name: `Time left : ${data.time_select}mins`,
          value: ``,
        },
        {
          name: "Remind :" + Reminder,
          value: ``,
        },
      ],
      footer: {
        text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
        icon_url: "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
      },
    };
    const continueId = randomUUID();
    const stopId = randomUUID();
    const removeId = randomUUID();
    // create ui component
    const button: ButtonComponent = createButton(continueId, "Continue", 3);
    const cancel: ButtonComponent = createButton(stopId, "Stop", 4);
    const remove: ButtonComponent = createButton(removeId, "Remove", 5);

    const actionRow = createActionRow([cancel, button, remove]);
    //send message to user that pomodoro has started
    const replyResponse = await message.reply({
      t: "",
      embed: [embedMessage],
      components: [actionRow],
    });
    const replyMessage = await channel.messages.fetch(replyResponse.message_id);
    const pomoMessageId = replyResponse.message_id;

    const user = await User.findOne({ id: message.sender_id });
    if (!user) {
      const mezonUser = await client.users.get(message.sender_id);
      const newUser = await User.create({
        id: message.sender_id,
        username: mezonUser?.username!,
      });
    }

    const task = await Task.create({
      title: data.task,
      duration: data.time_select,
      userId: message.sender_id,
    });

    let timeLeft = Number(data.time_select); // Số phút còn lại

    let interval = setInterval(async () => {
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(interval);
        await replyMessage.delete();
        await Task.findByIdAndUpdate(task._id, { isCompleted: true });
        await message.reply({
          t: "",
          embed: [
            {
              color: "#3eb806ff",
              title: "🍵TIME FOR A BREAK!",
              author: {
                name: `CONGRATULATIONS!`,
              },
              fields: [
                {
                  name: "⏲️Duration ",
                  value: `15mins`,
                  inline: true,
                },
                {
                  name: "Remind : Grab a cup of coffee or take a short walk!",
                  value: ``,
                },
              ],
              footer: {
                text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
                icon_url:
                  "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
              },
            },
          ],
        });
        return;
      }
      replyMessage.update({
        t: "",
        components: [actionRow],
        embed: [
          {
            color: "#000000ff",
            title: "⌛TIME TO FOCUS",
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
              {
                name: `Time left : ${timeLeft}mins`,
                value: ``,
              },
              {
                name: "Remind : " + Reminder,
                value: ``,
              },
            ],
            footer: {
              text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
              icon_url:
                "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
            },
          },
        ],
      });
    }, 1000);

    client.onMessageButtonClicked(async (btnEvent) => {
      if (btnEvent.message_id !== pomoMessageId) {
        return;
      }
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      if (btnEvent.button_id === stopId) {
        if (timeLeft <= 0) return;
        await replyMessage.update({
          t: "",
          components: [actionRow],
          embed: [
            {
              color: "#000000ff",
              title: "⌛TIME TO FOCUS",
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
                {
                  name: `Time left : ${timeLeft}mins (STOPPED)`,
                  value: ``,
                },
                {
                  name: "Remind : " + Reminder,
                  value: ``,
                },
              ],
              footer: {
                text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
                icon_url:
                  "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
              },
            },
          ],
        });
      } else if (btnEvent.button_id === continueId) {
        if (timeLeft <= 0) return;
        {
          await replyMessage.update({
            t: "",
            components: [actionRow],
            embed: [
              {
                color: "#000000ff",
                title: "⌛TIME TO FOCUS",
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
                  {
                    name: `Time left : ${timeLeft}mins`,
                    value: ``,
                  },
                  {
                    name: "Remind : " + Reminder,
                    value: ``,
                  },
                ],
                footer: {
                  text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
                  icon_url:
                    "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
                },
              },
            ],
          });
          interval = setInterval(async () => {
            timeLeft--;
            if (timeLeft < 0) {
              clearInterval(interval);
              await Task.findByIdAndUpdate(task._id, { isCompleted: true });
              await message.reply({
                t: "",
                embed: [
                  {
                    color: "#3eb806ff",
                    title: "🍵TIME FOR A BREAK!",
                    author: {
                      name: `CONGRATULATIONS!`,
                    },
                    fields: [
                      {
                        name: "⏲️Duration ",
                        value: `15mins`,
                        inline: true,
                      },
                      {
                        name: "Remind : Grab a cup of coffee or take a short walk!",
                        value: ``,
                      },
                    ],
                    footer: {
                      text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
                      icon_url:
                        "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
                    },
                  },
                ],
              });
              return;
            }
            await replyMessage.update({
              t: "",
              components: [actionRow],
              embed: [
                {
                  color: "#000000ff",
                  title: "⌛TIME TO FOCUS",
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
                    {
                      name: `Time left : ${timeLeft}mins`,
                      value: ``,
                    },
                    {
                      name: "Remind : " + Reminder,
                      value: ``,
                    },
                  ],
                  footer: {
                    text: "PomoBOT: Focus 100% on your task | Created by HOTBOT",
                    icon_url:
                      "https://cdn-icons-png.flaticon.com/512/14359/14359077.png",
                  },
                },
              ],
            });
          }, 1000);
        }
      } else if (btnEvent.button_id === removeId) {
        const pomo = await channel.messages.get(btnEvent.message_id);
        pomo?.delete();
      }
    });
  } catch (error) {
    message.reply({
      t: "All inputs are required",
    });
    console.log(error);
  }
}
