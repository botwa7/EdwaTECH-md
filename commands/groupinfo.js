async function run(sock, from, msg, args, config) {
    const groupMetadata = await sock.groupMetadata(from);
    
    const info = `
📊 *INFO GWOUPLA*

*Non:* ${groupMetadata.subject}
*ID:* ${groupMetadata.id}
*Moun:* ${groupMetadata.participants.length}
*Kreye:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}
*Owner:* ${groupMetadata.owner || 'Pa gen'}
    `.trim();
    
    await sock.sendMessage(from, { text: info });
}

module.exports = { run };
