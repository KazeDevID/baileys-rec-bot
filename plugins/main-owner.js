/**
 * Owner Contact Plugin
 */

let handler = async (m, { config }) => {
  const primaryOwner = config.ownerNumber[0]?.replace(/[^0-9]/g, '') || '6281234567890';
  
  const text = `╭─「 *OWNER BOT* 」
│ • *Nama:* ${config.ownerName}
│ • *Kontak:* wa.me/${primaryOwner}
│ • *GitHub:* https://github.com/KazeDevID
│ • *Channel:* ${config.newsletterName}
╰───────────────
_Silakan hubungi kontak di atas jika ada keperluan penting atau ingin berkontribusi._`;

  const buttons = [
    { type: 'call', id: 'callowner', text: '📞 Hubungi Owner', phone: `+${primaryOwner}` },
    { type: 'url', id: 'githubowner', text: '🌐 GitHub Profil', url: 'https://github.com/KazeDevID' },
    { type: 'reply', id: 'menu', text: '📜 Menu Utama' },
  ];

  await m.sendInteractive({
    title: '👑 Owner Information',
    text,
    footer: config.watermark,
    buttons,
    meta: {
      title: `Developer: ${config.ownerName}`,
      body: 'Author of baileys-rec library & bot architecture',
      sourceUrl: 'https://github.com/KazeDevID',
    },
  });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|creator|developer)$/i;

export default handler;
