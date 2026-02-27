async function run(sock, from, msg, args, config) {
    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants.map(p => p.id);
    
    let text = '📢 *TAGALL*\n\n';
    participants.forEach(p => {
        text += `@${p.split('@')[0]}\n`;
    });
    
    await sock.sendMessage(from, { text, mentions: participants });
}

module.exports = { run };
