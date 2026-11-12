/**
 * Runtime & Statistics Plugin
 */

import { clockString } from '../lib/helpers.js';

let handler = async (m, { config, db }) => {
  const uptime = clockString(process.uptime() * 1000);
  const stats = db ? db.data.stats : { totalCommands: 0, totalMessages: 0 };
  const totalUsers = db ? Object.keys(db.data.users).length : 1;

  const text = `╭─「 *STATUS AKTIF* 」
│ • *Uptime:* ${uptime}
│ • *Total Perintah:* ${stats.totalCommands || 0}
│ • *Total Pesan:* ${stats.totalMessages || 0}
│ • *Total Pengguna:* ${totalUsers}
│ • *Engine:* baileys-rec Node.js
╰───────────────`;

  const buttons = [
    { type: 'reply', id: 'menu', text: '📜 Menu Utama' },
    { type: 'reply', id: 'ping', text: '⚡ Speed Test' },
  ];

  await m.sendInteractive({
    title: '⏱️ Runtime Status',
    text,
    footer: config.watermark,
    buttons,
  });
};

handler.help = ['runtime', 'uptime'];
handler.tags = ['main'];
handler.command = /^(runtime|uptime)$/i;

export default handler;
