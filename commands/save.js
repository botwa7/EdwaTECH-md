async function run(sock, from, msg, args, config, senderId) {
    if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo) {
        return await sock.sendMessage(from, { text: '❌ Reply ak yon foto oswa yon videyo pou m sove l.' });
    }

    const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
    if (!quotedMsg) return;

    let mediaType = null;
    let mediaContent = null;

    if (quotedMsg.imageMessage) {
        mediaType = 'image';
        mediaContent = quotedMsg.imageMessage;
    } else if (quotedMsg.videoMessage) {
        mediaType = 'video';
        mediaContent = quotedMsg.videoMessage;
    } else if (quotedMsg.stickerMessage) {
        mediaType = 'sticker';
        mediaContent = quotedMsg.stickerMessage;
    } else {
        return await sock.sendMessage(from, { text: '❌ Sa a pa yon foto, videyo, oswa sticker.' });
    }

    const confirmMsg = await sock.sendMessage(from, { text: '💾 *Sove an prive!*' });
    const ownerJid = config.OWNER_NUMBER + '@s.whatsapp.net';
    
    const caption = `
📂 *MEDIA SOVE*
👤 Soti nan: ${from.endsWith('@g.us') ? 'Gwoup' : 'Privé'}
🕒 Dat: ${new Date().toLocaleString()}
    `.trim();

    try {
        const buffer = await sock.downloadMediaMessage(quotedMsg);
        
        await sock.sendMessage(ownerJid, {
            [mediaType]: buffer,
            caption: caption,
            mimetype: mediaContent.mimetype || ''
        });

        setTimeout(async () => {
            await sock.sendMessage(from, { delete: confirmMsg.key });
        }, 2000);

    } catch (error) {
        await sock.sendMessage(from, { text: '❌ Erè: ' + error.message });
    }
}

module.exports = { run };
