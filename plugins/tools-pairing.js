/**
 * Pairing Code Generator & Info Plugin
 */

let handler = async (m, { text, usedPrefix, command, config }) => {
  const replyText = `╭─「 *PAIRING CODE BAILEYS-REC* 」
│
│ Baileys-rec mendukung login via *Pairing Code*
│ 8-karakter tanpa perlu scan QR code kamera!
│
│ *Cara Menggunakan:*
│ 1. Jalankan bot di Web Dashboard atau Terminal
│ 2. Masukkan nomor WhatsApp (format: 628xxx)
│ 3. Dapatkan 8 digit kode unik (cth: \`ABCD-1234\`)
│ 4. Buka WhatsApp > Perangkat Tertaut > Tautkan
│ 5. Pilih "Tautkan dengan nomor telepon saja"
│ 6. Masukkan 8 digit kode tersebut. Selesai!
╰─────────────────────────`;

  const buttons = [
    { type: 'url', id: 'dash', text: '🌐 Buka Web Dashboard', url: config.repoUrl },
    { type: 'reply', id: 'menu', text: '📜 Menu Utama' },
  ];

  await m.sendInteractive({
    title: '🔑 WhatsApp Pairing Code Guide',
    text: replyText,
    buttons,
    footer: config.watermark,
  });
};

handler.help = ['pairing', 'paircode'];
handler.tags = ['tools'];
handler.command = /^(pairing|paircode|tautkan)$/i;

export default handler;
