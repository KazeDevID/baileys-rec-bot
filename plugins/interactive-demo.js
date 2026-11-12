/**
 * Interactive & Native Flow Buttons Showcase Plugin
 * Demonstrates all native flow buttons supported in baileys-rec.
 */

let handler = async (m, { usedPrefix, config }) => {
  const text = `╭─「 *INTERACTIVE DEMO* 」
│ Plugin ini mendemonstrasikan kemampuan
│ *Native Flow Buttons* & *Meta Cards*
│ yang ada pada *baileys-rec*:
│
│ 1. *Quick Reply:* Tombol respon cepat
│ 2. *CTA URL:* Membuka tautan eksternal
│ 3. *CTA Copy:* Menyalin teks/kode 1-klik
│ 4. *CTA Call:* Melakukan panggilan telepon
│ 5. *Meta Card:* WhatsApp Ad & Link preview
╰─────────────────────────`;

  const buttons = [
    { type: 'reply', id: 'ping', text: '⚡ Quick Reply (Ping)' },
    { type: 'url', id: 'gh', text: '🌐 Buka Repository', url: config.repoUrl },
    { type: 'copy', id: 'code', text: '📋 Salin Kode Contoh', code: 'npm install baileys-rec' },
    { type: 'call', id: 'tel', text: '📞 Panggilan Darurat', phone: '+628123456789' },
  ];

  await m.sendInteractive({
    title: '✨ Native Flow Interactive Buttons',
    text,
    footer: 'baileys-rec • Modern WhatsApp Features',
    buttons,
    meta: {
      title: '🚀 Baileys-Rec Native Flow Showcase',
      body: 'Dukungan tombol interaktif modern, call-to-action & card meta.',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      sourceUrl: config.repoUrl,
    },
  });
};

handler.help = ['buttondemo', 'interaktif'];
handler.tags = ['interactive'];
handler.command = /^(buttondemo|interaktif|demo)$/i;

export default handler;
