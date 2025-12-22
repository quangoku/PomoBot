import type { MessageButtonClicked } from "mezon-sdk/dist/cjs/rtapi/realtime.js";
import client from "../client.ts";

export async function handleCancelPomo(event: MessageButtonClicked) {
  const channel = await client.channels.fetch(event.channel_id);
  await channel.deleteEphemeral(event.user_id, event.message_id);
}
