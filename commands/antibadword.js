async function run(sock, from, msg, args, config) {
    const action = args[0];
    
    if (action === 'on') {
        await sock.sendMessage(from, { text: '✅ Antibadword AKTIVE' });
    } else if (action === 'off') {
        await sock.sendMessage(from, { text: '❌ Antibadword DEZAKTIVE' });
    } else {
        await sock.sendMessage(from, { text: 'Sèvi ak: .antibadword on/off' });
    }
}

module.exports = { run };
