import type { ChannelMessage } from "mezon-sdk";
import client from "../client.js";

export async function getHelp(event: ChannelMessage) {
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id!);

  const helpMessage = `**PomoBOT Help Menu**\n
    Here are the commands you can use:\n
    1. \`*pomo\` - Create a new Pomodoro session.\n
    2. \`*progress\` - Check your current Pomodoro progress.\n
    3. \`*leaderboard\` - View the Pomodoro leaderboard.\n
    4. \`*quote\` - Get an inspirational quote to keep you motivated.\n
    5. \`*help\` - Display this help menu.\n
    Focus on your tasks and boost your productivity with PomoBOT! 🚀`;
  await message.reply({
    t: helpMessage,
  });
}
