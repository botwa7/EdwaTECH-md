async function run(sock, from, msg, args, config) {
    if (!msg.message.extendedTextMessage) return;
    const user = msg.message.extendedTextMessage.contextInfo.participant;
    if (user) {
        await sock.groupParticipantsUpdate(from, [user], 'remove');
        await sock.sendMessage(from, { text: `👋 ${user.split('@')[0]} kite gwoup la!`, mentions: [user] });
    }
}

module.exports = { run };
