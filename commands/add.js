async function run(sock, from, msg, args, config) {
    if (!args[0]) return await sock.sendMessage(from, { text: '❌ Bay nimewo a!' });
    
    const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    try {
        await sock.groupParticipantsUpdate(from, [number], 'add');
        await sock.sendMessage(from, { text: `✅ ${args[0]} ajoute nan gwoup la!` });
    } catch (error) {
        await sock.sendMessage(from, { text: '❌ Pa ka ajoute l (Privasite l fèmen)' });
    }
}

module.exports = { run };
