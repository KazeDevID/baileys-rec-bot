/**
 * URL Shortener Utility Plugin
 */

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Contoh penggunaan: *${usedPrefix}${command} https://github.com/KazeDevID/baileys-rec*`);
  }

  const urlToShorten = text.trim();
  if (!urlToShorten.startsWith('http')) {
    return m.reply('❌ URL harus diawali dengan http:// atau https://');
  }

  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlToShorten)}`);
    const shortUrl = await res.text();

    const replyText = `╭─「 *SHORT LINK* 」
│ • *Original:* ${urlToShorten}
│ • *Short URL:* ${shortUrl}
╰──────────────`;

    await m.sendButton(replyText, 'Kaze Bot Tools', [
      { type: 'copy', id: 'copylink', text: '📋 Salin Link', code: shortUrl },
      { type: 'url', id: 'openlink', text: '🌐 Buka Link', url: shortUrl },
    ]);
  } catch (err) {
    m.reply(`❌ Gagal memperpendek link: ${err.message}`);
  }
};

handler.help = ['shortlink', 'short'];
handler.tags = ['tools'];
handler.command = /^(shortlink|short|tinyurl)$/i;
handler.limit = true;

export default handler;
