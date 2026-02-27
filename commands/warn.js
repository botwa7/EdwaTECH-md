let warnings = {};

async function run(sock, from, msg, args, config, senderId) {
    if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo) {
        return await sock.sendMessage(from, { text: '❌ Reply ak yon moun pou w avèti l!' });
    }
    
    const mentionedUser = msg.message.extendedTextMessage.contextInfo.participant;
    if (!mentionedUser) return;

    if (!warnings[mentionedUser]) warnings[mentionedUser] = 0;
    warnings[mentionedUser]++;

    const count = warnings[mentionedUser];
    
    if (count >= 3) {
        await sock.sendMessage(from, { text: `⚠️ ${mentionedUser.split('@')[0]} gen 3 avètisman! Kick!` });
        await sock.groupParticipantsUpdate(from, [mentionedUser], 'remove');
        warnings[mentionedUser] = 0;
    } else {
        await sock.sendMessage(from, { 
            text: `⚠️ *AVÈTISMAN!* @${mentionedUser.split('@')[0]}, ou gen ${count}/3`,
            mentions: [mentionedUser]
        });
    }
}

module.exports = { run };
