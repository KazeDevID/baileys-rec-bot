/**
 * Group TagAll / Hidetag Plugin
 */

let handler = async (m, { text, conn }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya dapat digunakan dalam grup!');

  const message = text || 'Pemberitahuan dari Admin Grup';
  
  const replyText = `╭─「 *PEMBERITAHUAN GRUP* 」
│ ${message}
╰───────────────────
_Menandai seluruh anggota grup secara otomatis._`;

  await m.reply(replyText);
};

handler.help = ['tagall', 'hidetag'];
handler.tags = ['group'];
handler.command = /^(tagall|hidetag|everyone)$/i;
handler.group = true;
handler.admin = true;

export default handler;
