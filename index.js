import { MezonClient } from "mezon-sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * @description Tạo cấu trúc tin nhắn tương tác (Action Rows) cho Pomodoro.
 * Sử dụng Select component để chọn thời gian và Input component để nhập URL.
 * @returns {Array} Mảng các hàng chứa Select, Input và Button.
 */
function createPomodoroSelectComponents() {
  // Lưu ý: Các giá trị enum phải được import hoặc biết trước
  const EMessageComponentType = { SELECT: 2, BUTTON: 1, INPUT: 3 };
  const EMessageSelectType = { TEXT: 1 };
  const EButtonMessageStyle = { SUCCESS: 3 };

  // 1. Select Component cho Thời gian làm việc
  const durationSelect = {
    type: EMessageComponentType.SELECT,
    id: "pomo_select_duration",
    component: {
      // Cấu trúc của SELECT component (Chọn từ danh sách)
      type: EMessageSelectType.TEXT,
      placeholder: "Chọn thời gian làm việc (phút)",
      options: [
        { label: "25 phút (Truyền thống)", value: "25" },
        { label: "45 phút", value: "45" },
        { label: "60 phút (Dài)", value: "60" },
      ],
      min_values: 1,
      max_values: 1,
    },
  };

  // 2. INPUT Component cho URL bài nhạc
  // Đã sửa cấu trúc component bên trong để phù hợp với EMessageComponentType.INPUT
  const songInput = {
    type: EMessageComponentType.INPUT,
    id: "pomo_song_url",
    // Thêm trường label tại đây, vì nhiều SDK yêu cầu
    label: "URL Bài Nhạc Lofi", // <--- THÊM LABEL Ở ĐÂY
    component: {
      options: {
        type: "text",
        placeholder:
          "Nhập URL bài nhạc lofi bạn muốn nghe (Ví dụ: https://youtube.com/...)",
      },
    },
  };

  // 3. Button "Bắt đầu"
  const startButton = {
    type: EMessageComponentType.BUTTON,
    id: "pomo_start_button",
    component: {
      label: "🚀 Bắt Đầu Pomodoro",
      style: EButtonMessageStyle.SUCCESS,
      disable: false,
    },
  };

  return [
    // Hàng 1: Select Thời gian làm việc
    { components: [durationSelect] },
    // Hàng 2: Input URL bài nhạc
    { components: [songInput] },
    // Hàng 3: Nút Bắt đầu
    { components: [startButton] },
  ];
}

async function main() {
  const client = new MezonClient({
    botId: process.env.BOT_ID,
    token: process.env.BOT_TOKEN,
  });

  await client.login();

  client.onChannelMessage(async (event) => {
    const channel = await client.channels.fetch(event.channel_id);
    const msg = await channel.messages.fetch(event.message_id);

    if (event.content.t === "*ping") {
      return msg.reply({ t: "Pong!" });
    } else if (event.content.t === "*pomo") {
      // Cấu trúc tin nhắn tương tác với Select Component và Button
      const pomodoroMessage = {
        t: "**⏰ Cấu hình Pomodoro Timer:**\nChọn thời gian làm việc và cung cấp URL nhạc lofi.",
        components: createPomodoroSelectComponents(),
      };

      // Trả lời bằng tin nhắn có hộp chọn và nút Start
      return msg.reply(pomodoroMessage);
    }
  });

  console.log("Bot đã khởi động!");
}

main().catch(console.error);
