async function run(sock, from, msg, args, config) {
    await sock.groupSettingUpdate(from, 'not_announcement');
    await sock.sendMessage(from, { text: '🔓 Gwoup la ouvri (Tout moun ka ekri)' });
}

module.exports = { run };
