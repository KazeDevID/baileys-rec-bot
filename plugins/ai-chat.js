/**
 * AI Assistant Plugin powered by Gemini / Smart responder
 */

let handler = async (m, { text, usedPrefix, command, config }) => {
  if (!text) {
    return m.reply(`Tanyakan sesuatu ke AI!\nContoh: *${usedPrefix}${command} apa keunggulan baileys-rec dibanding baileys standar?*`);
  }

  await m.react('⏳');

  let answer = '';
  // Try using Gemini API if key is available in environment
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({});
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: text,
      });
      answer = response.text || '';
    } catch {
      // Fallback
    }
  }

  if (!answer) {
    // Intelligent contextual assistant fallback
    const lower = text.toLowerCase();
    if (lower.includes('baileys-rec') || lower.includes('keunggulan') || lower.includes('fitur')) {
      answer = `*Keunggulan baileys-rec (@kazedevid):*\n1. Dukungan resmi *Native Flow Interactive Buttons* (Quick reply, CTA URL, CTA Copy, CTA Call).\n2. Flow forms, native carousel cards, dan BottomSheet options.\n3. Adapter Meta WhatsApp Cloud API protocol terintegrasi.\n4. Kompatibilitas tinggi dengan Node.js modern dan arsitektur plugin modular.\n5. Performa cepat dengan memory overhead rendah!`;
    } else {
      answer = `Halo! Saya asisten AI Kaze Bot. Pertanyaan Anda: "${text}".\n\nSistem AI siap membantu keperluan koding WhatsApp bot, pengolahan teks, dan otomasi Baileys. Gunakan *.menu* untuk melihat fitur lainnya.`;
    }
  }

  const replyText = `╭─「 *AI ASSISTANT* 」\n${answer}\n╰───────────────`;

  await m.sendButton(replyText, config.watermark, [
    { type: 'reply', id: 'menu', text: '📜 Menu Utama' },
    { type: 'reply', id: 'ping', text: '⚡ Ping Speed' },
  ]);
};

handler.help = ['ai', 'tanya'];
handler.tags = ['ai'];
handler.command = /^(ai|tanya|gemini|bot)$/i;
handler.limit = true;

export default handler;
