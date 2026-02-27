async function run(sock, from, msg, args, config) {
    const repoInfo = `
📦 *REPO OFISYÈL EDWA-MD*

*Bot:* ${config.BOT_NAME}
*Vèsyon:* ${config.VERSION}
*Dev:* ${config.OWNER_NAME}

🔗 *LYEN GITHUB:*
${config.REPO_LINK}

📥 *KIJAN POU W TELECHAJE L:*
1. Klike sou lyen an
2. Klike sou "Code" → "Download ZIP"
3. Dekonprime l epi swiv enstriksyon yo

⭐ *Pa bliye mete yon Star sou GitHub!*

📢 *Channel:* ${config.CHANNEL_LINK}
    `.trim();

    await sock.sendMessage(from, {
        text: repoInfo,
        contextInfo: {
            externalAdReply: {
                title: "EdwaTECH-md",
                body: "GitHub Repository",
                thumbnailUrl: "https://i.imgur.com/3YNv8Qp.png",
                mediaType: 1,
                renderLargerThumbnail: true,
                sourceUrl: config.REPO_LINK
            }
        }
    });

    await sock.sendMessage(from, {
        text: `🔗 *KLIKE ISIT POU W ALE DIRÈK:*\n${config.REPO_LINK}`
    });
}

module.exports = { run };
