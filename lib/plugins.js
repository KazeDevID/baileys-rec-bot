/**
 * Plugin Loader & Hot-Reloader for Kaze Baileys-Rec Bot
 * Inspired by Nurutomo's wabot-aq plugin architecture.
 */

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export class PluginManager {
  constructor(pluginsDir = './plugins') {
    this.pluginsDir = path.resolve(pluginsDir);
    this.plugins = new Map(); // filename -> plugin module
    this.commandMap = new Map(); // command string -> plugin module
    this.tagsMap = new Map(); // tag -> array of command objects
    this.watcher = null;
    this.onReloadCallback = null;
  }

  /**
   * Initialize and load all plugins from the directory
   */
  async loadAll() {
    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true });
    }

    const files = fs.readdirSync(this.pluginsDir).filter((f) => f.endsWith('.js'));
    this.plugins.clear();
    this.commandMap.clear();
    this.tagsMap.clear();

    for (const file of files) {
      await this.loadPlugin(file);
    }

    this.rebuildIndices();
    this.watch();
    return this.plugins.size;
  }

  /**
   * Load or reload a single plugin file
   */
  async loadPlugin(filename) {
    const filePath = path.join(this.pluginsDir, filename);
    try {
      // Append cache buster query for hot reload in ES Modules
      const fileUrl = `${pathToFileURL(filePath).href}?update=${Date.now()}`;
      const imported = await import(fileUrl);
      const handler = imported.default || imported.handler;

      if (typeof handler === 'function') {
        handler.filename = filename;
        handler.help = handler.help || [];
        handler.tags = handler.tags || ['tools'];
        handler.command = handler.command || [];
        
        this.plugins.set(filename, handler);
        return { success: true, filename };
      } else {
        console.warn(`[Plugin] Skipped ${filename}: default export is not a function`);
        return { success: false, filename, error: 'Not a function' };
      }
    } catch (err) {
      console.error(`[Plugin] Error loading ${filename}:`, err);
      return { success: false, filename, error: err.message };
    }
  }

  /**
   * Rebuild command and tag indices for lightning-fast lookup
   */
  rebuildIndices() {
    this.commandMap.clear();
    this.tagsMap.clear();

    for (const [filename, plugin] of this.plugins.entries()) {
      const tags = Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags || 'other'];

      for (const tag of tags) {
        if (!this.tagsMap.has(tag)) {
          this.tagsMap.set(tag, []);
        }
        this.tagsMap.get(tag).push({
          filename,
          help: plugin.help,
          tags: plugin.tags,
          command: plugin.command,
          limit: Boolean(plugin.limit),
          owner: Boolean(plugin.owner || plugin.rowner),
          admin: Boolean(plugin.admin),
        });
      }
    }
  }

  /**
   * Match a command text to its plugin
   */
  findPlugin(commandName) {
    if (!commandName) return null;
    const lowerCmd = commandName.toLowerCase();

    for (const plugin of this.plugins.values()) {
      const cmd = plugin.command;

      if (cmd instanceof RegExp) {
        if (cmd.test(lowerCmd)) return plugin;
      } else if (Array.isArray(cmd)) {
        if (cmd.some((c) => (c instanceof RegExp ? c.test(lowerCmd) : String(c).toLowerCase() === lowerCmd))) {
          return plugin;
        }
      } else if (typeof cmd === 'string') {
        if (cmd.toLowerCase() === lowerCmd) return plugin;
      }
    }

    return null;
  }

  /**
   * Watch plugins directory for file edits, adds, and deletions (Hot Reloading)
   */
  watch() {
    if (this.watcher) return;
    try {
      this.watcher = fs.watch(this.pluginsDir, async (eventType, filename) => {
        if (!filename || !filename.endsWith('.js')) return;
        const fullPath = path.join(this.pluginsDir, filename);

        if (fs.existsSync(fullPath)) {
          console.log(`[Plugin Watcher] Reloading modified plugin: ${filename}`);
          await this.loadPlugin(filename);
        } else {
          console.log(`[Plugin Watcher] Unloading deleted plugin: ${filename}`);
          this.plugins.delete(filename);
        }
        this.rebuildIndices();
        if (typeof this.onReloadCallback === 'function') {
          this.onReloadCallback(filename);
        }
      });
    } catch (err) {
      console.warn('[Plugin Watcher] File watch error:', err.message);
    }
  }

  /**
   * Return formatted tags and commands for Menu generator
   */
  getMenuCategories() {
    const categories = {};
    for (const [tag, items] of this.tagsMap.entries()) {
      const commands = [];
      for (const item of items) {
        if (Array.isArray(item.help)) {
          commands.push(...item.help);
        } else if (typeof item.help === 'string') {
          commands.push(item.help);
        }
      }
      categories[tag] = [...new Set(commands)].sort();
    }
    return categories;
  }

  /**
   * Get total plugin count
   */
  get count() {
    return this.plugins.size;
  }

  /**
   * Get all plugins formatted for web UI inspector
   */
  getAllForUI() {
    const list = [];
    for (const [filename, plugin] of this.plugins.entries()) {
      let code = '';
      try {
        code = fs.readFileSync(path.join(this.pluginsDir, filename), 'utf-8');
      } catch {}

      list.push({
        filename,
        help: plugin.help || [],
        tags: plugin.tags || [],
        command: plugin.command ? String(plugin.command) : '',
        owner: Boolean(plugin.owner || plugin.rowner),
        admin: Boolean(plugin.admin),
        limit: Boolean(plugin.limit),
        group: Boolean(plugin.group),
        private: Boolean(plugin.private),
        code,
      });
    }
    return list;
  }
}

export default PluginManager;
