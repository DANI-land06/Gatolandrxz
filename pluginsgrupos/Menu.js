const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const pref = (Array.isArray(global.prefixes) && global.prefixes[0]) || ".";

  try { await conn.sendMessage2(chatId, { react: { text: "✨", key: msg.key } }, msg); } catch {}

  try {
    const filePath = path.resolve("./setmenu.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const texto  = typeof data?.texto === "string" ? data.texto : "";
      const imagen = typeof data?.imagen === "string" && data.imagen.length ? data.imagen : null;

      if (texto.trim().length || imagen) {
        if (imagen) {
          const buffer = Buffer.from(imagen, "base64");
          await conn.sendMessage2(chatId, {
            image: buffer,
            caption: texto && texto.length ? texto : undefined
          }, msg);
          return;
        } else {
          await conn.sendMessage2(chatId, { text: texto }, msg);
          return;
        }
      }
    }
  } catch (e) {
    console.error("[menu] Error leyendo setmenu.json:", e);
  }

  const caption = `🚀 Gatoland 😼

╭━〔 *🧾 LISTA DE COMANDOS* 〕━⬣
│
*Sigue nuestro canal oficial del bot*
https://whatsapp.com/channel/0029VbBWlS73mFY7ovlF2a24

┃ *🛠️ .menu* — Ver la lista de comandos (detalladamente)

╭─〔 ⚙️ SERBOT 〕
│ • .code — convierte en Subbot 〔  solo 10 espacios 〕
│ • .qr ❌ Función no disponible
╰───────────────

╭─〔 📥 DESCARGAS 〕
│ • .play [nombre] — Descargar música
│ • .ytmp3 [link] — MP3 de YouTube
│ • .ytmp4 [link] — Video de YouTube
│ • .apk [nombre] — Descargar APK de Aptoide
│ • .fb [link] — Descargar video de Facebook
│ • .ig [link] — Descargar video de Instagram
│ • .mediafire [link] — Descargar archivo de MediaFire
│ • .tt [link] — Descargar video de TikTok
| • .pin [nombre] — descarga imagen desde pinterest 
╰───────────────

╭─〔 💰 ECONOMÍA 〕
│ • .work — Trabajar y ganar monedas
│ • .daily — Reclama tu recompensa diaria
│ • .baltop — Ranking de monedas
│ • .banco — Ver tu balance
│ • .cazar — Caza y gana recompensas
│ • .minar — Minar monedas
| • .talar — Tala árboles
| • .exclavisar — mensiona al usuario para que sea tu exclavo
| • .misexclavos — mira tu lista de exclavos
╰───────────────

╭─〔 👑 OWNER 〕
│ • .kick [@usuario]
│ • .group close/open — Cerrar o abrir grupo
│ • .fantasmas — Detectar usuarios inactivos
│ • .invocar — Mencionar a todos
│ • .link — Link del grupo
│ • .antilink
│ • .infogrupo
│ • .addco
│ • .Tag
│ • .invocar
│ • .owner
│ • .antilink — on/off
│ • .welcome — on/off
╰───────────────

╭─〔 🧰 TOOLS 〕
│ • .s — Crear sticker desde imagen
│ • .toimg — Convertir stickers en imagen
│ • .chatgpt — Pregunta algo a la IA
| • .toimg — convierte un sticker en imagen 
| • .hd — mejora la calidad de una imagen 
| • .tourl — convierte una imagen en un enlace
╰───────────────

╭─〔 🎮 GACHA 〕
│ • .rw — Mostrar personaje aleatorio
│ • .c — Reclamar personaje
│ • .venderpersonaje — Vender tu waifu 
│
╰───────────────

│ Biblia 📖〕
│.versiculo — muestra un versículo de la biblia aleatorio
│.historia — mira historias en la que muestran las escrituras de la biblia 
│.oracion — lee oraciones
|
╰─

|  Matemáticas 🧮〕
| • .matemáticas — resuelve problemas de matemáticas 
| • .responder — responde ala pregunta dicha por el bot
| • .puntaje — mira tu puntaje de matemáticas 🧮 
|
╰─

    Juegos
| • .ton — adivina la palabra clave o autocompleta la frase
|
╰─

〽️ *✦ 𝐆𝐚𝐭𝐨𝐋𝐚𝐧𝐝 ✦ MD* — El mejor bot para tu grupo ✨
`.trim();

  await conn.sendMessage2(chatId, {
    video: { url: "https://cdn.russellxz.click/a289f34c.mp4" },
    gifPlayback: true,
    caption
  }, msg);
};

handler.command = ["menu"];
handler.help = ["menu"];
handler.tags = ["menu"];

module.exports = handler;
