async function run(sock, from, msg, args, config) {
    await sock.groupSettingUpdate(from, 'announcement');
    await sock.sendMessage(from, { text: '🔒 Gwoup la fèmen (Se admin sèlman ki ka ekri)' });
}

module.exports = { run };
