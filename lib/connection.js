/**
 * Baileys-Rec Connection & Socket Manager
 * Handles multi-file auth, QR code generation, WhatsApp phone number Pairing Code,
 * and auto-reconnection events.
 */

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  fetchLatestBaileysVersion,
} from 'baileys-rec';
import pino from 'pino';
import qrcode from 'qrcode';
import { handler } from '../handler.js';

export class BotConnection {
  constructor(config, db, pluginManager, options = {}) {
    this.config = config;
    this.db = db;
    this.pluginManager = pluginManager;
    this.options = options;

    this.sock = null;
    this.state = 'disconnected'; // 'disconnected' | 'connecting' | 'qr' | 'pairing_code' | 'connected'
    this.qrData = null;
    this.qrDataUrl = null;
    this.pairingCode = null;
    this.phoneNumber = options.phoneNumber || null;
    this.connectMode = options.connectMode || 'qr'; // 'qr' | 'pairing'
    this.userInfo = null;
    this.startTime = Date.now();
    this.logs = [];

    this.onStateChange = options.onStateChange || null;
    this.onLog = options.onLog || null;
  }

  log(msg, type = 'info') {
    const entry = {
      timestamp: new Date().toLocaleTimeString(),
      text: msg,
      type,
    };
    this.logs.unshift(entry);
    if (this.logs.length > 200) this.logs.pop();
    console.log(`[Bot ${type.toUpperCase()}] ${msg}`);
    if (typeof this.onLog === 'function') this.onLog(entry);
  }

  emitState(newState) {
    this.state = newState;
    if (typeof this.onStateChange === 'function') {
      this.onStateChange({
        state: this.state,
        qr: this.qrData,
        qrDataUrl: this.qrDataUrl,
        pairingCode: this.pairingCode,
        user: this.userInfo,
      });
    }
  }

  async start(options = {}) {
    if (options.connectMode) this.connectMode = options.connectMode;
    if (options.phoneNumber) this.phoneNumber = options.phoneNumber;

    this.emitState('connecting');
    this.log(`Memulai koneksi Baileys-Rec (Mode: ${this.connectMode})...`, 'info');

    try {
      const { state: authState, saveCreds } = await useMultiFileAuthState(this.config.sessionDir);

      const socketConfig = {
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: authState,
        browser: Browsers.ubuntu('Chrome'),
        syncFullHistory: false,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
      };

      this.sock = makeWASocket(socketConfig);

      // Pairing Code flow if requested and not yet registered
      if (this.connectMode === 'pairing' && !authState.creds.registered && this.phoneNumber) {
        setTimeout(async () => {
          try {
            const cleanPhone = String(this.phoneNumber).replace(/[^0-9]/g, '');
            if (cleanPhone) {
              this.log(`Meminta Pairing Code untuk nomor: +${cleanPhone}...`, 'info');
              const code = await this.sock.requestPairingCode(cleanPhone);
              this.pairingCode = code;
              this.emitState('pairing_code');
              this.log(`Pairing Code berhasil dibuat: [ ${code} ]`, 'success');
            }
          } catch (err) {
            this.log(`Gagal meminta pairing code: ${err.message}`, 'error');
          }
        }, 2000);
      }

      // Connection update events
      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && this.connectMode === 'qr') {
          this.qrData = qr;
          try {
            this.qrDataUrl = await qrcode.toDataURL(qr, { margin: 2, scale: 7 });
          } catch {}
          this.emitState('qr');
          this.log('QR Code baru berhasil di-generate. Silakan scan di WhatsApp.', 'info');
        }

        if (connection === 'open') {
          this.userInfo = this.sock.user;
          this.qrData = null;
          this.qrDataUrl = null;
          this.pairingCode = null;
          this.emitState('connected');
          this.log(`Bot berhasil terhubung! Login sebagai: ${this.sock.user?.name || this.sock.user?.id}`, 'success');
        }

        if (connection === 'close') {
          const reason = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = reason !== DisconnectReason.loggedOut;
          this.log(`Koneksi terputus (Status: ${reason}). Mencoba koneksi ulang: ${shouldReconnect}`, 'warn');

          this.emitState('disconnected');
          if (shouldReconnect) {
            setTimeout(() => this.start(), 3000);
          }
        }
      });

      // Creds update
      this.sock.ev.on('creds.update', saveCreds);

      // Messages upsert listener
      this.sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
          await handler(this.sock, chatUpdate, {
            config: this.config,
            db: this.db,
            pluginManager: this.pluginManager,
            logStream: (msg, type) => this.log(msg, type),
          });
        } catch (err) {
          this.log(`Error dalam handler: ${err.message}`, 'error');
        }
      });

      return this.sock;
    } catch (err) {
      this.log(`Gagal menginisialisasi Baileys: ${err.message}`, 'error');
      this.emitState('disconnected');
      throw err;
    }
  }

  async stop() {
    this.log('Memutuskan sesi bot...', 'info');
    if (this.sock) {
      try {
        await this.sock.end();
      } catch {}
      this.sock = null;
    }
    this.emitState('disconnected');
  }
}

export default BotConnection;
