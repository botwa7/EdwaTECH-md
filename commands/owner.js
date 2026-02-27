async function run(sock, from, msg, args, config, senderId) {
    const messageText = `
👑 *OWNER OFISYÈL LA*

*Non:* ${config.OWNER_NAME}
*Nimewo:* ${config.OWNER_NUMBER}

📲 *KLIKE SOU LYEN SA A:*
${config.OWNER_LINK}
    `.trim();

    await sock.sendMessage(from, { text: messageText });
    await sock.sendMessage(from, { text: `🔗 *LYEN DIRÈK:* ${config.OWNER_LINK}` });
}

module.exports = { run };
