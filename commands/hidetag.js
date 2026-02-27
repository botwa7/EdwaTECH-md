async function run(sock, from, msg, args, config) {
    if (!args[0]) return await sock.sendMessage(from, { text: '❌ Bay yon mesaj!' });
    
    const groupMetadata = await sock.groupMetadata(from);
    const participants = groupMetadata.participants.map(p => p.id);
    
    await sock.sendMessage(from, {
        text: args.join(' '),
        mentions: participants
    });
}

module.exports = { run };
