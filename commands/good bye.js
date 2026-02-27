async function run(sock, from, msg, args, config) {
    await sock.sendMessage(from, { text: '✅ Goodbye mesaj aktive pou gwoup sa a!' });
}

module.exports = { run };
