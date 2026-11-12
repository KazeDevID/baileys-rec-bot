/**
 * Bot Mode Plugin (Public vs Self Mode)
 */

let handler = async (m, { text, config }) => {
  const current = config.selfMode;
  config.selfMode = !current;

  const statusStr = config.selfMode ? '🔒 *SELF MODE* (Hanya Owner)' : '🌐 *PUBLIC MODE* (Semua Pengguna)';

  await m.reply(`Mode bot berhasil diubah menjadi:\n${statusStr}`);
};

handler.help = ['setmode', 'self'];
handler.tags = ['owner'];
handler.command = /^(setmode|self|public)$/i;
handler.owner = true;

export default handler;
