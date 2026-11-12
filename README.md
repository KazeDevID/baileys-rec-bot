# ⚡ Kaze Baileys-Rec WhatsApp Bot

WhatsApp bot modern berkinerja tinggi yang dibangun menggunakan **Node.js (ES Module / JS Only)**, ditenagai oleh library **[baileys-rec](https://www.npmjs.com/package/baileys-rec)** buatan **KazeDevID**, dengan arsitektur **Plugins Handler modular** ala [wabot-aq](https://github.com/Nurutomo/wabot-aq).

Dilengkapi tampilan menu chat **simpel tanpa deskripsi tiap menu**, pesan **interaktif**, **native flow buttons**, dan **kartu metadata externalAdReply**.

---

## ✨ Fitur Utama

- 🚀 **Engine Terbaru:** Ditenagai oleh `baileys-rec` v1.3.0 dengan dukungan native WhatsApp Interactive Buttons.
- 🧩 **Modular Plugin Handler (wabot-aq style):** Struktur plugin mandiri di dalam folder `plugins/*.js` dengan hot-reloading otomatis tanpa restart bot.
- 🔒 **Non-Global Config:** Konfigurasi tidak mencemari `global`, melainkan diekspor dan dioper melalui context `{ config, conn, m }`.
- 💬 **Tampilan Menu Simpel:** Tanpa deskripsi panjang yang mengotori layar; bersih, rapi, dan terorganisir per kategori tag.
- 🎛️ **Interaktif & Native Flow Buttons:** Mendukung tombol Quick Reply, CTA URL, CTA Copy Code, dan CTA Call.
- 🖼️ **Meta Preview Card:** Header kartu pratinjau media dan WhatsApp Newsletter/Channel context info.
- 🔑 **Dual Login:** Scan QR Code kamera atau **Pairing Code 8-karakter** tanpa scan kamera.

---

## 📁 Struktur Direktori

```
├── config.js              # Konfigurasi non-global modular
├── handler.js             # Core message & plugin event dispatcher
├── index.js               # Entry point runner bot
├── package.json           # Dependensi standalone bot
├── database.json          # Database JSON lokal (users, chats, settings)
├── lib/
│   ├── connection.js      # Socket connection manager (QR & Pairing Code)
│   ├── database.js        # Modul database JSON mandiri
│   ├── helpers.js         # Format waktu, RAM, uptime, dan utilitas
│   ├── interactive.js     # Builder native flow button & meta baileys-rec
│   ├── plugins.js         # Loader & hot-reloader plugin
│   └── serialize.js       # Serializer pesan (m.reply, m.sendInteractive)
└── plugins/
    ├── main-menu.js       # Menu simpel interaktif
    ├── main-ping.js       # Speed test & respon latency
    ├── main-owner.js      # Kontak owner & tombol vCard
    ├── main-runtime.js    # Statistik server & masa aktif
    ├── tools-calc.js      # Kalkulator matematika aman
    ├── tools-pairing.js   # Panduan pairing code
    ├── tools-shortlink.js # Pemendek URL
    ├── interactive-demo.js# Showcase seluruh tipe tombol baileys-rec
    ├── ai-chat.js         # Asisten AI
    ├── media-download.js  # Downloader media
    ├── sticker-maker.js   # Pembuat stiker
    ├── group-admin.js     # Manajemen grup admin
    ├── group-tagall.js    # Mention semua anggota grup
    ├── owner-eval.js      # Evaluator kode JavaScript owner
    ├── owner-broadcast.js # Kirim siaran pesan
    ├── owner-mode.js      # Pengganti mode Public / Self
    └── owner-reload.js    # Reload hot plugin
```

---

## 🚀 Panduan Instalasi

### 1. Di Termux (Android)
```bash
# Update paket Termux
pkg update -y && pkg upgrade -y
pkg install nodejs git -y

# Clone repository
git clone https://github.com/KazeDevID/baileys-rec-bot.git
cd baileys-rec-bot

# Install dependensi
npm install

# Jalankan bot dengan QR Code
npm start

# ATAU jalankan dengan Pairing Code (ganti nomor telepon kamu)
node index.js --pairing --phone=6281234567890
```

### 2. Di VPS (Ubuntu / Debian / CentOS)
```bash
# Install Node.js LTS (v20+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Clone repo & jalankan
git clone https://github.com/KazeDevID/baileys-rec-bot.git
cd baileys-rec-bot
npm install

# Menjalankan 24/7 di latar belakang dengan PM2
sudo npm install -g pm2
pm2 start index.js --name "kaze-bot"
pm2 save
pm2 startup
```

---

## 🧩 Cara Membuat Plugin Baru

Buat file baru di dalam direktori `plugins/` (contoh: `plugins/contoh.js`):

```js
let handler = async (m, { conn, text, usedPrefix, command, config }) => {
  // Balas pesan biasa
  await m.reply(`Halo *${m.pushName}*! Kamu menjalankan ${usedPrefix}${command}`);

  // Kirim pesan interaktif dengan tombol
  await m.sendButton('Pilih salah satu opsi:', config.watermark, [
    { type: 'reply', id: 'ping', text: '⚡ Ping' },
    { type: 'url', id: 'gh', text: '🌐 GitHub', url: config.repoUrl },
  ]);
};

handler.help = ['contoh'];
handler.tags = ['tools'];
handler.command = /^(contoh|sample)$/i;
handler.limit = true; // Kurangi limit pengguna saat dijalankan
handler.owner = false; // Set true jika hanya boleh untuk owner

export default handler;
```

Bot akan **secara otomatis mendeteksi dan me-reload** file baru tersebut tanpa perlu mematikan server bot!

---

## 📄 Lisensi
Didistribusikan di bawah lisensi MIT. Dibuat oleh **KazeDevID**.
