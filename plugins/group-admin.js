/**
 * Group Admin Management Plugin
 */

let handler = async (m, { text, command }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya dapat digunakan dalam grup!');

  const replyText = `╭─「 *GROUP ADMIN ACTION* 」
│ • *Perintah:* ${command}
│ • *Grup:* Terdeteksi
│ • *Status:* Siap mengeksekusi aksi grup
╰───────────────────────`;

  await m.reply(replyText);
};

handler.help = ['kick', 'promote', 'demote', 'groupinfo'];
handler.tags = ['group'];
handler.command = /^(kick|promote|demote|groupinfo|infogrup)$/i;
handler.group = true;
handler.admin = true;

export default handler;
