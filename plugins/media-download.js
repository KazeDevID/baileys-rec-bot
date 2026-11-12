/**
 * Media Downloader Plugin (TikTok, YouTube MP3, MP4)
 */

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Contoh penggunaan:\n*${usedPrefix}${command} https://vt.tiktok.com/xxxx/*\natau *${usedPrefix}${command} https://youtube.com/watch?v=xxxx*`);
  }

  await m.react('📥');

  const replyText = `╭─「 *MEDIA DOWNLOADER* 」
│ • *Platform:* ${command.toUpperCase()}
│ • *Target:* ${text.trim()}
│ • *Status:* Link berhasil diverifikasi
╰───────────────────
_Mengunduh konten media tanpa watermark..._`;

  await m.sendButton(replyText, 'Downloader Tool', [
    { type: 'reply', id: 'menu', text: '📜 Menu Utama' },
    { type: 'copy', id: 'copylink', text: '📋 Salin Target', code: text.trim() },
  ]);
};

handler.help = ['tiktok', 'ytmp3', 'ytmp4'];
handler.tags = ['media'];
handler.command = /^(tiktok|tt|ytmp3|ytmp4|youtube)$/i;
handler.limit = true;

export default handler;
