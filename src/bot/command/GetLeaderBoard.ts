import type { ChannelMessage, IInteractiveMessageProps } from "mezon-sdk";
import client from "../client.ts";
import Task from "../../db/models/task.model.ts";

export async function getLeaderBoard(event: ChannelMessage) {
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id!);

  const leaderboard = await Task.aggregate([
    { $match: { isCompleted: true } },
    {
      $group: {
        _id: "$userId",
        totalTimeFocus: { $sum: { $toDouble: "$duration" } },
        taskCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users", // Collection name mặc định của mongoose là lowercase + 's'
        localField: "_id", // userId từ Task sau khi group
        foreignField: "id", // Field 'id' trong User schema (không phải '_id')
        as: "userInfo",
      },
    },
    { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        username: "$userInfo.username",
        totalTimeFocus: 1,
        taskCount: 1,
      },
    },
    { $sort: { totalTimeFocus: -1 } },
    { $limit: 10 },
  ]);

  const embedMessage: IInteractiveMessageProps = {
    color: "#ffea00ff",
    title: "***LEADERBOARD***",
    author: {
      name: `🏆 Top 10 Focus Masters 🏆`,
    },
    fields: [
      ...leaderboard.map((entry, index) => ({
        name: `#${index + 1} ${
          index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""
        } : ${entry.username || "Unknown User"}`,
        value: `Total Focus Time: ${entry.totalTimeFocus.toFixed(
          2
        )} mins | Tasks Completed: ${entry.taskCount}`,
        inline: false,
      })),
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
