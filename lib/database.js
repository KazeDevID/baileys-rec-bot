/**
 * Modular JSON Database Manager (Users, Chats, Settings)
 * Zero global pollution. State is encapsulated within the Database instance.
 */

import fs from 'fs';
import path from 'path';

export class Database {
  constructor(filePath = './database.json') {
    this.filePath = path.resolve(filePath);
    this.data = {
      users: {},
      chats: {},
      settings: {
        selfMode: false,
        autoTyping: false,
        autoRead: true,
        welcome: true,
      },
      stats: {
        totalMessages: 0,
        totalCommands: 0,
      },
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || {},
          chats: parsed.chats || {},
          settings: { ...this.data.settings, ...(parsed.settings || {}) },
          stats: { ...this.data.stats, ...(parsed.stats || {}) },
        };
      } else {
        this.save();
      }
    } catch {
      this.save();
    }
  }

  save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database:', e.message);
    }
  }

  getUser(jid, defaultUser = {}) {
    if (!this.data.users[jid]) {
      this.data.users[jid] = {
        name: 'WhatsApp User',
        limit: 25,
        exp: 0,
        level: 1,
        role: 'Bronze Member',
        banned: false,
        registered: false,
        lastCommand: 0,
        ...defaultUser,
      };
      this.save();
    }
    return this.data.users[jid];
  }

  updateUser(jid, updater) {
    const user = this.getUser(jid);
    if (typeof updater === 'function') {
      updater(user);
    } else if (typeof updater === 'object') {
      Object.assign(user, updater);
    }
    this.save();
    return user;
  }

  getChat(jid) {
    if (!this.data.chats[jid]) {
      this.data.chats[jid] = {
        mute: false,
        welcome: true,
        antiLink: false,
        totalMessages: 0,
      };
      this.save();
    }
    return this.data.chats[jid];
  }

  incrementCommandStat() {
    this.data.stats.totalCommands = (this.data.stats.totalCommands || 0) + 1;
    this.data.stats.totalMessages = (this.data.stats.totalMessages || 0) + 1;
  }
}

export default Database;
