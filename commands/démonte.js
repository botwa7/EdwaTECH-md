async function run(sock, from, msg, args, config) {
    if (!msg.message.extendedTextMessage) return;
    const user = msg.message.extendedTextMessage.contextInfo.participant;
    if (user) {
        await sock.groupParticipantsUpdate(from, [user], 'demote');
        await sock.sendMessage(from, { text: `📉 ${user.split('@')[0]} retrograde!`, mentions: [user] });
    }
}

module.exports = { run };
