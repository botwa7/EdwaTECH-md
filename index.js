const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    Browsers
} = require('gifted-baileys');
const pino = require('pino');
const readline = require('readline');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

function question(text) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: Browsers.ubuntu('Chrome'),
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr, pairingCode } = update;

        if (qr) {
            io.emit('qr', qr);
        }

        if (pairingCode && !sock.authState.creds.registered) {
            console.log('\n=== PAIRING CODE ===');
            console.log('Kòd apèl la:', pairingCode);
            console.log('====================\n');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                setTimeout(startBot, 3000);
            } else {
                console.log('Koneksyon fèmen nèt. Efase auth_info_baileys pou rekòmanse.');
                process.exit(0);
            }
        } else if (connection === 'open') {
            console.log('✅ KONEKSYON REYISI!');
            io.emit('connected', true);
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        const messageType = Object.keys(msg.message)[0];
        if (messageType === 'protocolMessage' || messageType === 'senderKeyDistributionMessage') return;
        
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        
        if (text.toLowerCase() === 'bonjou') {
            await sock.sendMessage(from, { text: 'Bonjou! Bot la aktif.' });
        }
    });
}

startBot().catch(console.error);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Sèvè ap kouri sou: http://localhost:${PORT}`);
});
