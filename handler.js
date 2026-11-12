/**
 * Core Message & Event Handler for Kaze Baileys-Rec Bot
 * Built strictly according to wabot-aq architecture by Nurutomo.
 * NON-GLOBAL config and database: passed through context.
 */

import { serialize } from './lib/serialize.js';

/**
 * Handle incoming messages upsert from baileys-rec
 */
export async function handler(sock, chatUpdate, context = {}) {
  const { config, db, pluginManager, logStream } = context;

  if (!chatUpdate || !chatUpdate.messages) return;
  const rawMsg = chatUpdate.messages[0];
  if (!rawMsg || !rawMsg.message) return;

  // Ignore status broadcast updates
  if (rawMsg.key?.remoteJid === 'status@broadcast') return;

  // Serialize message into rich 'm' object
  const m = serialize(sock, rawMsg, config);
  if (!m) return;

  // Ignore empty messages
  if (!m.text && !rawMsg.message.imageMessage && !rawMsg.message.videoMessage) return;

  // Identify sender & check owner status
  const isOwner = Boolean(
    m.fromMe ||
    (config.ownerNumber && config.ownerNumber.some((num) => {
      const clean = num.replace(/[^0-9]/g, '');
      return m.sender.includes(clean);
    }))
  );

  // Self-mode check: if active, ignore non-owner commands
  if (config.selfMode && !isOwner) return;

  // Update User & Chat database records
  const user = db ? db.getUser(m.sender, { name: m.pushName }) : { limit: 25, exp: 0, level: 1 };
  if (db && m.isGroup) {
    db.getChat(m.chat);
  }

  // Handle button clicks or non-prefixed interactive responses
  let command = m.command;
  let usedPrefix = m.usedPrefix;

  // If message came from a button click without a prefix, check if it matches a known command
  if (!m.isCommand && m.text) {
    const rawFirstWord = m.text.trim().split(/\s+/)[0].toLowerCase();
    const testPlugin = pluginManager.findPlugin(rawFirstWord);
    if (testPlugin) {
      command = rawFirstWord;
      usedPrefix = '.';
      m.isCommand = true;
      m.command = command;
      m.usedPrefix = usedPrefix;
      m.args = m.text.trim().split(/\s+/).slice(1);
    }
  }

  // If not a command, ignore
  if (!m.isCommand || !command) return;

  // Log incoming command
  const logLine = `[CMD] ${usedPrefix}${command} from ${m.pushName || m.sender} in ${m.isGroup ? 'Group' : 'Private'}`;
  console.log(logLine);
  if (typeof logStream === 'function') logStream(logLine, 'cmd');

  // Find matching plugin
  const plugin = pluginManager.findPlugin(command);
  if (!plugin) return; // Silent ignore for unregistered commands

  // Permission Checks:
  // 1. Owner check
  if ((plugin.owner || plugin.rowner) && !isOwner) {
    return m.reply(`⚠️ *Akses Ditolak*\nPerintah \`${usedPrefix}${command}\` hanya dapat digunakan oleh Owner bot!`);
  }

  // 2. Group check
  if (plugin.group && !m.isGroup) {
    return m.reply(`⚠️ Perintah \`${usedPrefix}${command}\` hanya dapat digunakan di dalam Grup!`);
  }

  // 3. Private check
  if (plugin.private && m.isGroup) {
    return m.reply(`⚠️ Perintah \`${usedPrefix}${command}\` hanya dapat digunakan di Private Chat!`);
  }

  // 4. Limit check & deduction
  if (plugin.limit && !isOwner) {
    const cost = typeof plugin.limit === 'number' ? plugin.limit : 1;
    if (user.limit < cost) {
      return m.reply(`⚠️ *Limit Habis*\nLimit kamu tidak mencukupi untuk menjalankan \`${usedPrefix}${command}\`.\nSisa limit: *${user.limit}*`);
    }
    user.limit -= cost;
    if (db) db.save();
  }

  // Increment total stats
  if (db) db.incrementCommandStat();

  // Execute Plugin
  try {
    const pluginContext = {
      sock,
      conn: sock,
      text: m.args.join(' '),
      args: m.args,
      usedPrefix,
      command,
      isOwner,
      isAdmin: false, // In groups, admin check helper can be called if needed
      isGroup: m.isGroup,
      config,
      db,
      pluginManager,
      user,
    };

    await plugin.call(this, m, pluginContext);
  } catch (err) {
    console.error(`[Plugin Error] in ${plugin.filename || command}:`, err);
    if (typeof logStream === 'function') {
      logStream(`[Error] in ${plugin.filename || command}: ${err.message}`, 'error');
    }
    await m.reply(`❌ *Terjadi Kesalahan*\nPlugin: \`${plugin.filename || command}\`\nPesan: _${err.message}_`);
  }
}

export default handler;
