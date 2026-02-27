let antilink = {};

async function run(sock, from, msg, args, config) {
    const action = args[0];
    
    if (action === 'on') {
        antilink[from] = true;
        await sock.sendMessage(from, { text: '✅ Antilink AKTIVE' });
    } else if (action === 'off') {
        antilink[from] = false;
        await sock.sendMessage(from, { text: '❌ Antilink DEZAKTIVE' });
    } else {
        await sock.sendMessage(from, { text: 'Sèvi ak: .antilink on/off' });
    }
}

module.exports = { run };
