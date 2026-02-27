async function run(sock, from, msg, args, config) {
    if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo.quotedMessage) {
        return await sock.sendMessage(from, { text: '❌ Reply ak yon imaj!' });
    }
    
    const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
    if (quoted.imageMessage) {
        const buffer = await sock.downloadMediaMessage(quoted);
        await sock.updateProfilePicture(from, buffer);
        await sock.sendMessage(from, { text: '✅ Foto pwofil gwoup la chanje!' });
    }
}

module.exports = { run };
