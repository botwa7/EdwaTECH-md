const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const config = require('./config');
const express = require('express');

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(text, (answer) => { rl.close(); resolve(answer); });
    });
};

const messagesStore = new Map();
let globalSock = null;
let pairingCode = '';
let qrCodeData = '';

// ================= EXPRESS WEB SERVER =================
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sèvi fichye estatik
app.use('/static', express.static('public'));

// Page prensipal (Session Generator)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/session.html');
});

// API: Jwenn Pairing Code (MODIFYE)
app.post('/api/pair', async (req, res) => {
    const { phone } = req.body;
    
    if (!phone) {
        return res.json({ success: false, error: 'Nimewo telefòn obligatwa' });
    }
    
    try {
        if (!globalSock) {
            return res.json({ success: false, error: 'Bot la pa konekte ankò' });
        }
        
        // Tcheke si bot la pare pou pairing        const creds = globalSock.authState?.creds;
        if (creds?.registered) {
            return res.json({ success: false, error: 'Bot la deja konekte!' });
        }
        
        // Jwenn kòd la
        const code = await globalSock.requestPairingCode(phone.trim());
        pairingCode = code;
        
        res.json({ 
            success: true, 
            code: code,
            message: 'Kòd la jenere avèk siksè!'
        });
    } catch (error) {
        console.error('Pairing error:', error);
        res.json({ 
            success: false, 
            error: 'Erè: ' + error.message 
        });
    }
});

// API: Jwenn QR Code (imaj base64)
app.get('/api/qr', async (req, res) => {
    if (qrCodeData) {
        res.json({ 
            success: true, 
            qr: qrCodeData 
        });
    } else {
        res.json({ 
            success: false, 
            error: 'Pa gen QR Code disponib kounye a' 
        });
    }
});

// API: Status Bot
app.get('/api/status', (req, res) => {
    res.json({
        status: globalSock ? 'connected' : 'disconnected',
        bot: config.BOT_NAME,
        version: config.VERSION,
        owner: config.OWNER_NAME,
        plugins: config.PLUGINS_LIST.length,
        pairingCode: pairingCode || null
    });
});
// ================= BOT CONNECTION =================
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,  // MODIFYE: true pou QR parèt nan logs
        auth: state,
        generateHighQualityLinkPreview: true
    });

    globalSock = sock;

    let pairingCodeSent = false;
    
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr, pairingCode: pCode } = update;
        
        // QR Code
        if (qr) {
            try {
                qrCodeData = await qrcode.toDataURL(qr);
            } catch (e) {
                console.log('Erè QR:', e);
            }
            
            if (!config.USE_PAIRING_CODE) {
                console.log('\n🔥 SCANNE QR CODE A...\n');
                qrcode.generate(qr, { small: true });
            }
        }
        
        // Pairing Code
        if (pCode && config.USE_PAIRING_CODE && !pairingCodeSent) {
            console.log('\n📱 === PAIRING CODE AUTHENTICATION ===');
            const choice = await question('1. Pairing Code (Rekomande)\n2. QR Code\nChwa w: ');
            
            if (choice === '1') {
                const phoneNumber = await question('Antre nimewo WhatsApp (egzanp: 50948887766): ');
                const code = await sock.requestPairingCode(phoneNumber.trim());
                pairingCodeSent = true;
                pairingCode = code;
                console.log(`\n✅ PAIRING CODE OU A: ${code}`);
                console.log('⚠️  Ale nan WhatsApp → Paramèt → Aparèy konekte → Konekte ak nimewo\n');
            } else {
                console.log('\n🔥 QR Code ap parèt...\n');
                qrcode.generate(qr, { small: true });
            }
        }
                if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('🔁 Rekoneksi...');
                startBot();
            } else {
                console.log('❌ Koneksyon fèmen nèt.');
                process.exit(0);
            }
        } else if (connection === 'open') {
            console.log(`\n✅ ${config.BOT_NAME} KONEKTE!`);
            console.log(`📦 Plugins chaje: ${config.PLUGINS_LIST.length}`);
            console.log(`🌐 Web Server: http://localhost:${PORT}`);
            console.log(`📱 Session Site: http://localhost:${PORT}`);
            pairingCode = '';
            qrCodeData = '';
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Anti-Delete, Anti-ViewOnce, elatriye
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        
        const from = msg.key.remoteJid;
        const senderId = msg.key.participant || msg.key.remoteJid;
        const messageId = msg.key.id;
        const isStatus = from === 'status@broadcast';
        const isGroup = from.endsWith('@g.us');

        if (isGroup && config.ANTI_DELETE) {
            messagesStore.set(messageId, {
                message: msg.message,
                from: from,
                sender: senderId,
                timestamp: Date.now()
            });
        }

        if (isStatus && config.AUTO_STATUS_REACT) {
            await sock.sendMessage(from, { react: { text: '❤️', key: msg.key } });
            return;
        }

        if (config.ANTI_VIEW_ONCE) {
            const messageType = Object.keys(msg.message)[0];
            if (messageType === 'viewOnceMessage' || messageType === 'viewOnceMessageV2') {
                const viewOnceContent = msg.message[messageType].message;                const type = Object.keys(viewOnceContent)[0];
                const caption = viewOnceContent[type].caption || "🚫 Anti-ViewOnce!";
                const ownerJid = config.OWNER_NUMBER + '@s.whatsapp.net';
                
                try {
                    const buffer = await sock.downloadMediaMessage(viewOnceContent[type]);
                    await sock.sendMessage(ownerJid, {
                        [type]: buffer,
                        caption: `${caption}\n\n📍 ${from}`,
                        mimetype: viewOnceContent[type].mimetype || ''
                    });
                } catch (error) {
                    console.error('Erè anti-viewonce:', error);
                }
                return;
            }
        }

        if (config.AUTO_RECORDING && !isStatus && msg.message.conversation) {
            await sock.sendPresenceUpdate('recording', from);
            setTimeout(() => sock.sendPresenceUpdate('composing', from), 3000);
        }

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!text.startsWith(config.PREFIX)) return;

        const args = text.slice(config.PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const commandPath = path.join(__dirname, 'commands', `${command}.js`);

        if (fs.existsSync(commandPath)) {
            try {
                const commandModule = require(commandPath);
                await commandModule.run(sock, from, msg, args, config, senderId);
            } catch (error) {
                console.error(`Erè ${command}:`, error);
            }
        }
    });

    sock.ev.on('messages.delete', async (deleteUpdate) => {
        if (!config.ANTI_DELETE) return;
        // Anti-delete logic here
    });
}

// ================= DEMARE SERVE A =================
app.listen(PORT, () => {
    console.log(`\n🌐 Web Server ap kouri sou port ${PORT}`);
    console.log(`📱 Session Site: http://localhost:${PORT}`);    console.log(`🔧 API Status: http://localhost:${PORT}/api/status\n`);
});

console.log('🚀 Edwa-md v2.1 ap demare...');
startBot().catch(console.error);
