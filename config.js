/**
 * Kaze Baileys-Rec Bot Configuration
 * NOTE: Config is strictly modular and NOT global.
 * Passed explicitly via context { config } to handlers and plugins.
 */

export const config = {
  // Bot Identity
  botName: 'Kaze-Bot',
  ownerName: 'KazeDevID',
  ownerNumber: ['6281234567890@s.whatsapp.net', '6281234567890'],
  
  // Command Prefix regex: matches ., !, or # at start of message
  prefix: /^[.!#]/,
  
  // Storage & Session Directory
  sessionDir: './session-baileys',
  databasePath: './database.json',
  
  // Mode: false = public (anyone can use), true = self/owner only
  selfMode: false,
  
  // Default User Limits
  userDefault: {
    limit: 25,
    exp: 0,
    level: 1,
    role: 'Bronze Member',
    banned: false,
    registered: false,
  },
  
  // GitHub Repository
  repoUrl: 'https://github.com/KazeDevID/baileys-rec-bot',
  author: 'KazeDevID',
  
  // Newsletter / Channel forwarding meta
  newsletterJid: '120363043809511111@newsletter',
  newsletterName: '⚡ KazeDevID Updates',
  
  // Interactive Message Meta Card (WhatsApp externalAdReply context)
  metaCard: {
    title: '⚡ Kaze Baileys-Rec WhatsApp Bot',
    body: 'Modern WABot • Interactive Buttons • Modular Plugins',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    sourceUrl: 'https://github.com/KazeDevID/baileys-rec-bot',
    renderLargerThumbnail: true,
    showAdAttribution: true,
  },
  
  // Bot Watermark
  watermark: '© 2026 KazeDevID • baileys-rec v1.3.0',
};

export default config;
