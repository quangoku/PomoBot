import type {
  ChannelMessageContent,
  IInteractiveMessageProps,
  IMessageActionRow,
} from "mezon-sdk";
import type { Message } from "mezon-sdk/dist/cjs/mezon-client/structures/Message.js";
import type { TextChannel } from "mezon-sdk/dist/cjs/mezon-client/structures/TextChannel.js";

export async function getMessage(
  channel: TextChannel,
  messageId: string
): Promise<Message> {
  try {
    const message = await channel.messages.fetch(messageId);
    return message;
  } catch (error) {
    console.error(`Failed to fetch message ${messageId}:`, error);
    throw error;
  }
}

export async function replyToMessage(
  originalMessage: Message,
  replyText: string
) {
  try {
    const content: ChannelMessageContent = {
      t: replyText,
    };

    const response = await originalMessage.reply(content);
    console.log(`Replied to message ${originalMessage.id}`);
    return response;
  } catch (error) {
    console.error(`Failed to reply to message ${originalMessage.id}:`, error);
    throw error;
  }
}

// components and embed is optional
export async function replyWithExtras(
  originalMessage: Message,
  replyText: string,
  components?: IMessageActionRow[] | any,
  embed?: IInteractiveMessageProps[] | any
) {
  try {
    const content: ChannelMessageContent = {
      t: replyText,
      components: components,
      embed: embed,
    };

    const response = await originalMessage.reply(content);

    return response;
  } catch (error) {
    console.error(`Failed to send reply with extras:`, error);
    throw error;
  }
}
