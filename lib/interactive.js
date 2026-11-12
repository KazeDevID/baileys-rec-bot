/**
 * Interactive Message & Meta Builder powered by baileys-rec
 * Provides native flow buttons, list menus, externalAdReply metadata, and newsletter contexts.
 */

import { ButtonBuilder, buildInteractiveMessage, sendInteractiveMessage } from 'baileys-rec';

/**
 * Construct native flow buttons array using baileys-rec ButtonBuilder
 * Supported types:
 * - reply: Quick reply button
 * - url: CTA URL button
 * - copy: Copy code button
 * - call: Phone call button
 * - list: Single select list menu
 */
export function createButtonBuilder() {
  return new ButtonBuilder();
}

/**
 * Format buttons array for baileys-rec
 * @param {Array<{type: 'reply'|'url'|'copy'|'call'|'list', id: string, text: string, url?: string, code?: string, phone?: string, title?: string, sections?: any[]}>} buttonsList
 */
export function compileButtons(buttonsList = []) {
  const builder = new ButtonBuilder();

  for (const btn of buttonsList) {
    if (!btn) continue;
    const type = btn.type || 'reply';
    
    switch (type) {
      case 'reply':
        builder.addReply(btn.id || btn.text, btn.text);
        break;
      case 'url':
        builder.addUrl(btn.id || 'url', btn.text, btn.url || 'https://github.com/KazeDevID');
        break;
      case 'copy':
        builder.addCopy(btn.id || 'copy', btn.text, btn.code || btn.text);
        break;
      case 'call':
        builder.addCall(btn.id || 'call', btn.text, btn.phone || '');
        break;
      case 'list':
        builder.addList(btn.id || 'list', btn.text, btn.title || 'Choose Option', btn.sections || []);
        break;
      default:
        builder.addReply(btn.id || btn.text, btn.text);
    }
  }

  return builder.build();
}

/**
 * Build externalAdReply metadata context object for WhatsApp rich previews
 */
export function buildContextInfo(meta = {}, config = {}) {
  const mergedMeta = {
    ...(config.metaCard || {}),
    ...meta,
  };

  const contextInfo = {
    externalAdReply: {
      title: mergedMeta.title || '⚡ Kaze Baileys-Rec Bot',
      body: mergedMeta.body || 'WhatsApp Bot with Native Flow & Interactive Buttons',
      previewType: 'PHOTO',
      thumbnailUrl: mergedMeta.thumbnail || mergedMeta.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      sourceUrl: mergedMeta.sourceUrl || config.repoUrl || 'https://github.com/KazeDevID/baileys-rec-bot',
      renderLargerThumbnail: mergedMeta.renderLargerThumbnail !== false,
      showAdAttribution: true,
    },
  };

  if (config.newsletterJid) {
    contextInfo.forwardedNewsletterMessageInfo = {
      newsletterJid: config.newsletterJid,
      newsletterName: config.newsletterName || 'Kaze Dev Channel',
      serverMessageId: -1,
    };
  }

  return contextInfo;
}

/**
 * Send an interactive message with baileys-rec native flow buttons and rich meta card
 */
export async function sendRichInteractive(sock, jid, {
  title = '',
  text = '',
  footer = '',
  buttons = [],
  meta = null,
  image = null,
  video = null,
}, options = {}, config = {}) {
  const nativeButtons = Array.isArray(buttons) && buttons.length > 0
    ? compileButtons(buttons)
    : undefined;

  const content = {
    title,
    text,
    footer: footer || config.watermark || '',
    buttons: nativeButtons,
    image,
    video,
  };

  const contextInfo = meta ? buildContextInfo(meta, config) : undefined;
  const mergedOptions = {
    ...options,
    ...(contextInfo ? { contextInfo } : {}),
  };

  try {
    return await sendInteractiveMessage(sock, jid, content, mergedOptions);
  } catch (err) {
    // If interactive fails, fallback gracefully to clean standard message with meta
    let fallbackText = text;
    if (title) fallbackText = `*${title}*\n\n${fallbackText}`;
    if (footer) fallbackText = `${fallbackText}\n\n_${footer}_`;
    
    return await sock.sendMessage(jid, {
      text: fallbackText,
      ...(contextInfo ? { contextInfo } : {}),
    }, options);
  }
}
