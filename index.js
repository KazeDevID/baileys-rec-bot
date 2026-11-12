/**
 * Kaze Baileys-Rec Bot - Main Standalone Runner
 * Pure Node.js (ES Module), Zero Global Config.
 */

import { config } from './config.js';
import { Database } from './lib/database.js';
import { PluginManager } from './lib/plugins.js';
import { BotConnection } from './lib/connection.js';

console.log(`
╔═══════════════════════════════════════════════════════════╗
║   ⚡ KAZE BAILEYS-REC WHATSAPP BOT - NODE.JS JS ONLY     ║
║   Architecture: wabot-aq Plugin Handler (by Nurutomo)     ║
║   Library: baileys-rec v1.3.0 by KazeDevID                ║
║   Features: Native Flow Buttons, Meta Cards, Pair Code    ║
╚═══════════════════════════════════════════════════════════╝
`);

async function main() {
  console.log('[System] Menginisialisasi Database JSON...');
  const db = new Database(config.databasePath);

  console.log('[System] Memuat Plugin Handler...');
  const pluginManager = new PluginManager('./plugins');
  const total = await pluginManager.loadAll();
  console.log(`[System] Berhasil memuat ${total} plugin modular (Hot Reloading aktif)`);

  // Prompt pairing or QR mode based on environment or argument
  const isPairing = process.argv.includes('--pairing');
  const phoneArg = process.argv.find((a) => a.startsWith('--phone='));
  const phoneNumber = phoneArg ? phoneArg.replace('--phone=', '') : null;

  const connection = new BotConnection(config, db, pluginManager, {
    connectMode: isPairing ? 'pairing' : 'qr',
    phoneNumber,
  });

  await connection.start();
}

main().catch((err) => {
  console.error('[Fatal Error]', err);
  process.exit(1);
});
