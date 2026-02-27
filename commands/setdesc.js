async function run(sock, from, msg, args, config) {
    if (!args[0]) return await sock.sendMessage(from, { text: '❌ Bay yon deskripsyon!' });
    
    await sock.groupUpdateDescription(from, args.join(' '));
    await sock.sendMessage(from, { text: '✅ Deskripsyon gwoup la chanje!' });
}

module.exports = { run };
