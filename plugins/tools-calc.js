/**
 * Calculator & Math Utility Plugin
 */

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Contoh penggunaan: *${usedPrefix}${command} 25 * 4 + 100*`);
  }

  // Sanitize math string (only allow numbers, operators, parens, decimal, spaces)
  const sanitized = text.replace(/[^0-9+\-*/().%^ ]/g, '');
  if (!sanitized) {
    return m.reply('❌ Karakter tidak valid untuk kalkulasi matematika.');
  }

  try {
    // Safe evaluation using Function
    const result = Function(`'use strict'; return (${sanitized})`)();
    
    const replyText = `╭─「 *KALKULATOR* 」
│ • *Soal:* ${text}
│ • *Hasil:* *${result}*
╰──────────────`;

    await m.sendButton(replyText, 'Kaze Bot Tools', [
      { type: 'copy', id: 'copycalc', text: '📋 Salin Hasil', code: String(result) },
      { type: 'reply', id: 'menu', text: '📜 Menu' },
    ]);
  } catch (err) {
    m.reply(`❌ Gagal menghitung ekspresi matematika: ${err.message}`);
  }
};

handler.help = ['calc', 'hitung'];
handler.tags = ['tools'];
handler.command = /^(calc|hitung|kalkulator)$/i;

export default handler;
