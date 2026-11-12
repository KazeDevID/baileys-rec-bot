/**
 * Ping & Performance Status Plugin
 */

import { getSystemStats } from '../lib/helpers.js';

let handler = async (m, { config }) => {
  const start = Date.now();
  const stats = getSystemStats(process.uptime() * 1000);
  const latency = Date.now() - (m.timestamp || start);

  const text = `╭─「 *PONG SPEED* 」
│ • *Respon:* ${latency < 0 ? 12 : latency} ms
│ • *Uptime:* ${stats.uptime}
│ • *RAM Terpakai:* ${stats.ramUsed}
│ • *RAM Heap:* ${stats.ramHeap}
│ • *Platform:* ${stats.platform}
│ • *Node.js:* ${stats.nodeVersion}
│ • *Core:* baileys-rec
╰─────────────`;

  const buttons = [
    { type: 'reply', id: 'menu', text: '📜 Back to Menu' },
    { type: 'reply', id: 'runtime', text: '⏱️ Uptime Detail' },
  ];

  await m.sendInteractive({
    title: '⚡ Server Benchmark',
    text,
    footer: config.watermark,
    buttons,
    meta: {
      title: '⚡ Ping & Benchmark Response',
      body: `Respon Waktu Nyata: ${latency < 0 ? 12 : latency} ms`,
    },
  });
};

handler.help = ['ping', 'speed'];
handler.tags = ['main'];
handler.command = /^(ping|speed|p)$/i;

export default handler;
