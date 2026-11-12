/**
 * Hot-Reload All Plugins Plugin
 */

let handler = async (m, { pluginManager }) => {
  const count = await pluginManager.loadAll();
  await m.reply(`✅ Berhasil me-reload seluruh plugin (*${count}* plugin aktif) tanpa me-restart bot!`);
};

handler.help = ['reload'];
handler.tags = ['owner'];
handler.command = /^(reload|refreshplugins)$/i;
handler.owner = true;

export default handler;
