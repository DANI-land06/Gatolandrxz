const fs = require("fs");
const path = require("path");

const gifUrls = [
  "https://cdn.russellxz.click/5b056a4b.mp4",
  "https://cdn.russellxz.click/5c5a4f5c.mp4",
  "https://cdn.russellxz.click/f70fb41b.mp4",
  "https://cdn.russellxz.click/45e2ec30.mp4"
];

const textos = [
  "馃拫 *@1 bes贸 apasionadamente a @2* 馃槼",
  "馃槏 *@1 le plant贸 un beso intenso a @2* 馃挄",
  "馃槝 *@1 no resisti贸 y bes贸 a @2* 馃挅",
  "馃敟 *@1 y @2 se dieron un beso ardiente* 馃挦",
  "馃挊 *@1 bes贸 con ternura a @2* 馃槡",
  "馃挒 *@1 no dud贸 y bes贸 a @2 bajo la luna* 馃寵",
  "馃槼 *@1 rob贸 un beso a @2* 馃挮",
  "馃サ *@1 no aguant贸 las ganas y bes贸 a @2* 馃槏",
  "馃憚 *@1 y @2 se dieron un beso inolvidable* 鉁�",
  "鉂わ笍 *@1 bes贸 a @2 como en una novela rom谩ntica* 馃摉"
];

const KISS_PATH = path.resolve("kiss_data.json");
const KISS_COOLDOWN = 10 * 60 * 1000; // 10 minutos

const handler = async (msg, { conn, args }) => {
  const isGroup = msg.key.remoteJid.endsWith("@g.us");
  const chatId = msg.key.remoteJid;

  if (!isGroup) {
    return conn.sendMessage(chatId, {
      text: "鈿狅笍 Este comando solo se puede usar en grupos."
    }, { quoted: msg });
  }

  // Reacci贸n inicial
  await conn.sendMessage(chatId, {
    react: { text: "馃拫", key: msg.key }
  });

  const senderID = msg.key.participant || msg.key.remoteJid;
  const senderNum = senderID.split("@")[0];

  // Obtener destinatario: citado o mencionado
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  let targetID;

  if (ctx?.participant) {
    targetID = ctx.participant;
  } else if (args[0]) {
    const raw = args[0].replace(/[^0-9]/g, "");
    if (raw) targetID = `${raw}@s.whatsapp.net`;
  }

  if (!targetID) {
    return conn.sendMessage(chatId, {
      text: "⚔️ Responde al mensaje o menciona a alguien para besarlo 💋"
    }, { quoted: msg });
  }

  if (targetID === senderID) {
    return conn.sendMessage(chatId, {
      text: "😼 No puedes besarte a ti mismo cachondo..."
    }, { quoted: msg });
  }

  let data = fs.existsSync(KISS_PATH) ? JSON.parse(fs.readFileSync(KISS_PATH)) : {};
  if (!data[chatId]) data[chatId] = { besosDados: {}, besosRecibidos: {} };

  const ahora = Date.now();
  const last = data[chatId].besosDados[senderNum]?.usuarios?.[targetID]?.last || 0;

  if (ahora - last < KISS_COOLDOWN) {
    const mins = Math.ceil((KISS_COOLDOWN - (ahora - last)) / 60000);
    return conn.sendMessage(chatId, {
      text: `鈴� Debes esperar *${mins} minuto(s)* para volver a besar a ese usuario.`,
      mentions: [targetID]
    }, { quoted: msg });
  }

  // Guardar besos dados
  if (!data[chatId].besosDados[senderNum]) {
    data[chatId].besosDados[senderNum] = { total: 0, usuarios: {} };
  }
  if (!data[chatId].besosDados[senderNum].usuarios[targetID]) {
    data[chatId].besosDados[senderNum].usuarios[targetID] = { count: 0, last: 0 };
  }
  data[chatId].besosDados[senderNum].total += 1;
  data[chatId].besosDados[senderNum].usuarios[targetID].count += 1;
  data[chatId].besosDados[senderNum].usuarios[targetID].last = ahora;

  // Guardar besos recibidos
  const targetNum = targetID.split("@")[0];
  if (!data[chatId].besosRecibidos[targetNum]) {
    data[chatId].besosRecibidos[targetNum] = { total: 0, usuarios: {} };
  }
  if (!data[chatId].besosRecibidos[targetNum].usuarios[senderNum]) {
    data[chatId].besosRecibidos[targetNum].usuarios[senderNum] = 0;
  }
  data[chatId].besosRecibidos[targetNum].total += 1;
  data[chatId].besosRecibidos[targetNum].usuarios[senderNum] += 1;

  fs.writeFileSync(KISS_PATH, JSON.stringify(data, null, 2));

  // GIF y mensaje aleatorio
  const gif = gifUrls[Math.floor(Math.random() * gifUrls.length)];
  const texto = textos[Math.floor(Math.random() * textos.length)]
    .replace("@1", `@${senderNum}`)
    .replace("@2", `@${targetNum}`);

  await conn.sendMessage(chatId, {
    video: { url: gif },
    gifPlayback: true,
    caption: texto,
    mentions: [senderID, targetID]
  }, { quoted: msg });
};

handler.command = ["kiss"];
module.exports = handler;
