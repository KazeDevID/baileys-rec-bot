/**
 * Sticker Maker & Converter Plugin
 */

let handler = async (m, { usedPrefix, command }) => {
  const replyText = `╭─「 *STICKER MAKER* 」
│ Kirim atau reply gambar/video pendek dengan
│ caption *${usedPrefix}${command}* untuk membuat stiker WhatsApp!
│
│ • Dukungan rasio: 1:1 square
│ • Format: WebP dengan EXIF Packname
│ • Packname: Kaze Baileys-Rec Bot
╰─────────────────────`;

  await m.sendButton(replyText, 'Sticker Utility', [
    { type: 'reply', id: 'menu', text: '📜 Menu Utama' },
  ]);
};

handler.help = ['sticker', 's'];
handler.tags = ['media'];
handler.command = /^(s|sticker|stiker)$/i;
handler.limit = true;

export default handler;
