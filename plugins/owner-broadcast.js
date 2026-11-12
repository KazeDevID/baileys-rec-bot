/**
 * Owner Broadcast Plugin
 */

let handler = async (m, { text, config }) => {
  if (!text) return m.reply('Ketik pesan siaran yang ingin dikirimkan.');

  const broadcastText = `╭─「 *SIARAN RESMI BOT* 」
│ ${text}
╰───────────────────
_Pesan resmi dari Developer ${config.ownerName}_`;

  await m.sendButton(broadcastText, config.watermark, [
    { type: 'url', id: 'gh', text: '🌐 GitHub Repo', url: config.repoUrl },
    { type: 'reply', id: 'menu', text: '📜 Menu' },
  ]);
};

handler.help = ['broadcast', 'bc'];
handler.tags = ['owner'];
handler.command = /^(broadcast|bc)$/i;
handler.owner = true;

export default handler;
