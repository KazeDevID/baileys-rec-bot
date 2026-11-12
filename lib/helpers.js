/**
 * General helper utilities for Kaze Baileys-Rec Bot
 */

import os from 'os';

/**
 * Format milliseconds into clean human-readable clock string
 * e.g. 2h 15m 30s
 */
export function clockString(ms) {
  if (isNaN(ms) || ms < 0) return '0s';
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  const d = Math.floor(ms / 86400000);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

/**
 * Format bytes to readable string (KB, MB, GB)
 */
export function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get system runtime & performance stats
 */
export function getSystemStats(startTime) {
  const uptimeMs = Date.now() - (startTime || Date.now());
  const memUsage = process.memoryUsage();
  const cpus = os.cpus() || [];
  const model = cpus[0]?.model || 'Generic CPU';

  return {
    uptime: clockString(uptimeMs),
    uptimeMs,
    ramUsed: formatSize(memUsage.rss),
    ramHeap: formatSize(memUsage.heapUsed),
    cpuModel: model,
    platform: `${os.type()} (${os.arch()})`,
    nodeVersion: process.version,
  };
}

/**
 * Normalize phone number or JID
 */
export function cleanJid(number) {
  if (!number) return '';
  let cleaned = String(number).replace(/[^0-9]/g, '');
  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.slice(2);
  }
  return cleaned.includes('@s.whatsapp.net') ? cleaned : `${cleaned}@s.whatsapp.net`;
}

/**
 * Sleep helper
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
