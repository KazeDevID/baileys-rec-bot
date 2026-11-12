/**
 * Owner JavaScript Evaluator Plugin
 * Safe inspection & execution of code on running bot instance.
 */

import util from 'util';

let handler = async (m, { text, sock, conn, config, db, pluginManager }) => {
  if (!text) return m.reply('Ketik kode JavaScript yang ingin dievaluasi.');

  let output;
  try {
    let evaled = await eval(text);
    if (typeof evaled !== 'string') {
      evaled = util.inspect(evaled, { depth: 1 });
    }
    output = evaled;
  } catch (err) {
    output = err.stack || err.message;
  }

  const replyText = `╭─「 *EVAL RESULT* 」\n${output}\n╰───────────────`;
  await m.reply(replyText);
};

handler.help = ['eval', '>'];
handler.tags = ['owner'];
handler.command = /^(eval|>)$/i;
handler.owner = true;

export default handler;
