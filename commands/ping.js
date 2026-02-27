async function run(sock, from, msg, args, config) {
    const start = Date.now();
    await sock.sendMessage(from, { text: '📶 Testing...' });
    const end = Date.now();
    const speed = (end - start) / 1000;
    
    await sock.sendMessage(from, { text: `⚡ Speed: ${speed.toFixed(4)} ms\n🟢 Bot aktif!` });
}

module.exports = { run };
