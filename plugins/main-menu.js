/**
 * Main Menu Plugin for Kaze Baileys-Rec Bot
 * Feature: Simple clean menu WITHOUT command descriptions, interactive buttons & meta card.
 */

import { clockString } from '../lib/helpers.js';

let handler = async (m, { conn, usedPrefix, command, pluginManager, config, user }) => {
  const categories = pluginManager.getMenuCategories();
  
  const uptime = clockString(process.uptime() * 1000);
  const totalPlugins = pluginManager.count;
  
  // Simple Header
  let menuText = `╭─「 *${config.botName.toUpperCase()}* 」\n`;
  menuText += `│ • *User:* ${m.pushName || 'User'}\n`;
  menuText += `│ • *Limit:* ${user.limit || 0}\n`;
  menuText += `│ • *Uptime:* ${uptime}\n`;
  menuText += `│ • *Engine:* baileys-rec v1.3.0\n`;
  menuText += `│ • *Total Plugins:* ${totalPlugins}\n`;
  menuText += `╰───────────────\n\n`;

  // Desired order of category display
  const tagOrder = ['main', 'tools', 'interactive', 'ai', 'media', 'group', 'owner'];
  const tagNames = {
    main: 'MAIN MENU',
    tools: 'TOOLS & UTILITY',
    interactive: 'INTERACTIVE & BUTTONS',
    ai: 'ARTIFICIAL INTELLIGENCE',
    media: 'MEDIA & DOWNLOAD',
    group: 'GROUP MANAGEMENT',
    owner: 'OWNER ONLY',
  };

  // Build simple menu list without per-command descriptions
  const processedTags = new Set();

  for (const tag of tagOrder) {
    if (categories[tag] && categories[tag].length > 0) {
      processedTags.add(tag);
      const categoryTitle = tagNames[tag] || tag.toUpperCase();
      menuText += `╭─「 *${categoryTitle}* 」\n`;
      for (const cmd of categories[tag]) {
        menuText += `│ • ${usedPrefix}${cmd}\n`;
      }
      menuText += `╰────\n\n`;
    }
  }

  // Any remaining tags
  for (const [tag, cmds] of Object.entries(categories)) {
    if (!processedTags.has(tag) && cmds.length > 0) {
      menuText += `╭─「 *${tag.toUpperCase()}* 」\n`;
      for (const cmd of cmds) {
        menuText += `│ • ${usedPrefix}${cmd}\n`;
      }
      menuText += `╰────\n\n`;
    }
  }

  menuText += `_Gunakan salah satu tombol interaktif di bawah atau ketik perintah langsung._`;

  // Native flow interactive buttons
  const buttons = [
    { type: 'reply', id: 'ping', text: '⚡ Speed & Ping' },
    { type: 'reply', id: 'owner', text: '👑 Owner Info' },
    { type: 'url', id: 'github', text: '🌐 GitHub Repo', url: config.repoUrl },
    { type: 'copy', id: 'copyinfo', text: '📋 Salin Prefix', code: usedPrefix },
  ];

  // Send interactive message with meta card
  await m.sendInteractive({
    title: `⚡ ${config.botName} Interactive Menu`,
    text: menuText,
    footer: config.watermark,
    buttons,
    meta: {
      title: `${config.botName} • Baileys-Rec`,
      body: 'Menu Simpel Interaktif dengan Native Flow Buttons',
      sourceUrl: config.repoUrl,
    },
  });
};

handler.help = ['menu', 'help', '?'];
handler.tags = ['main'];
handler.command = /^(menu|help|\?)$/i;

export default handler;
