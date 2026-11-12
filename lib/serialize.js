/**
 * WhatsApp Message Serializer for baileys-rec
 * Parses raw proto messages and decorates with handy reply and interactive methods.
 */

import { sendRichInteractive } from './interactive.js';

/**
 * Extract text from all Baileys message types, including interactive button replies
 */
export function getMessageText(message) {
  if (!message) return '';

  if (typeof message.conversation === 'string') return message.conversation;
  if (typeof message.extendedTextMessage?.text === 'string') return message.extendedTextMessage.text;
  if (typeof message.imageMessage?.caption === 'string') return message.imageMessage.caption;
  if (typeof message.videoMessage?.caption === 'string') return message.videoMessage.caption;
  if (typeof message.documentMessage?.caption === 'string') return message.documentMessage.caption;

  // Baileys Interactive Response Message (Button Click)
  if (message.interactiveResponseMessage) {
    const resp = message.interactiveResponseMessage;
    if (resp.nativeFlowResponseMessage?.paramsJson) {
      try {
        const parsed = JSON.parse(resp.nativeFlowResponseMessage.paramsJson);
        return parsed.id || parsed.selected_id || parsed.command || '';
      } catch {
        return resp.nativeFlowResponseMessage.paramsJson;
      }
    }
    if (resp.body?.text) return resp.body.text;
  }

  // Template button reply
  if (message.templateButtonReplyMessage?.selectedId) {
    return message.templateButtonReplyMessage.selectedId;
  }

  // Quick reply button response
  if (message.buttonsResponseMessage?.selectedButtonId) {
    return message.buttonsResponseMessage.selectedButtonId;
  }

  // List response message
  if (message.listResponseMessage?.singleSelectReply?.selectedRowId) {
    return message.listResponseMessage.singleSelectReply.selectedRowId;
  }

  return '';
}

/**
 * Serialize raw Baileys message into enriched 'm' object
 */
export function serialize(sock, rawMsg, config = {}) {
  if (!rawMsg || !rawMsg.key) return null;

  const key = rawMsg.key;
  const chat = key.remoteJid || '';
  const isGroup = chat.endsWith('@g.us');
  const fromMe = Boolean(key.fromMe);
  const sender = fromMe
    ? (sock.user?.id?.split(':')[0] + '@s.whatsapp.net' || 'me')
    : (isGroup ? (key.participant || rawMsg.participant || '') : chat);

  const pushName = rawMsg.pushName || 'WhatsApp User';
  const text = getMessageText(rawMsg.message).trim();

  // Parse prefix and command
  const prefixMatch = config.prefix ? config.prefix.exec(text) : /^[.!#]/.exec(text);
  const usedPrefix = prefixMatch ? prefixMatch[0] : '';
  const isCommand = Boolean(usedPrefix);
  
  let command = '';
  let args = [];
  if (isCommand) {
    const trimmed = text.slice(usedPrefix.length).trim();
    const split = trimmed.split(/\s+/);
    command = (split[0] || '').toLowerCase();
    args = split.slice(1);
  }

  const m = {
    raw: rawMsg,
    key,
    id: key.id || '',
    chat,
    sender,
    isGroup,
    fromMe,
    pushName,
    text,
    body: text,
    usedPrefix,
    isCommand,
    command,
    args,
    timestamp: typeof rawMsg.messageTimestamp === 'number'
      ? rawMsg.messageTimestamp * 1000
      : Date.now(),

    // Helper: Reply with text and optional quoting
    async reply(replyText, options = {}) {
      return sock.sendMessage(chat, {
        text: String(replyText),
        ...options,
      }, { quoted: rawMsg, ...options });
    },

    // Helper: React to message with emoji
    async react(emoji) {
      return sock.sendMessage(chat, {
        react: { text: emoji, key: rawMsg.key },
      });
    },

    // Helper: Send Interactive message with buttons and meta
    async sendInteractive(payload, options = {}) {
      return sendRichInteractive(sock, chat, payload, {
        quoted: rawMsg,
        ...options,
      }, config);
    },

    // Helper: Send buttons
    async sendButton(bodyText, footerText, buttons = [], options = {}) {
      return sendRichInteractive(sock, chat, {
        text: bodyText,
        footer: footerText,
        buttons,
      }, { quoted: rawMsg, ...options }, config);
    },

    // Helper: Send message with meta externalAdReply card
    async sendMeta(bodyText, metaCard = {}, options = {}) {
      return sendRichInteractive(sock, chat, {
        text: bodyText,
        meta: metaCard,
      }, { quoted: rawMsg, ...options }, config);
    },
  };

  return m;
}

export default serialize;
