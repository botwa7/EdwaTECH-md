const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    Browsers
} = require('gifted-baileys');
const pino = require('pino');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

// Sèvi ak session.html kòm paj prensipal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'session.html'));
});

let sock;
let qrCodeData = null;
let pairingCodeData = null;
let isConnecting = false;

async function startBot() {
    if (isConnecting) return;
    isConnecting = true;

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
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
            qrCodeData = qr;
            pairingCodeData = null;
            io.emit('qr_update', qr);
        }

        if (pairingCode) {
            pairingCodeData = pairingCode;
            qrCodeData = null;
            io.emit('pairing_update', pairingCode);
        }

        if (connection === 'close') {
            isConnecting = false;
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                setTimeout(startBot, 3000);
            } else {
                console.log('Koneksyon fèmen nèt.');
                io.emit('status_update', { status: 'disconnected' });
            }
        } else if (connection === 'open') {
            isConnecting = false;
            console.log('✅ KONEKSYON REYISI!');
            io.emit('status_update', { status: 'connected' });
            qrCodeData = null;
            pairingCodeData = null;
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
            await sock.sendMessage(from, { text: 'Bonjou! Bot la aktif. 🤖' });
        }
    });
}
// API pou Status
app.get('/api/status', (req, res) => {
    const status = sock && sock.user ? 'connected' : 'disconnected';
    res.json({ status });
});

// API pou Pairing Code
app.post('/api/pair', async (req, res) => {
    const { phone } = req.body;
    
    if (!sock) {
        return res.json({ success: false, error: 'Bot la pa pare.' });
    }

    if (!phone || phone.length < 10) {
        return res.json({ success: false, error: 'Nimewo pa valid.' });
    }

    try {
        if (pairingCodeData) {
            return res.json({ success: true, code: pairingCodeData });
        }

        const code = await sock.requestPairingCode(phone);
        pairingCodeData = code;
        qrCodeData = null;
        io.emit('pairing_update', code);
        
        res.json({ success: true, code: code });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// API pou QR Code
app.get('/api/qr', async (req, res) => {
    if (qrCodeData) {
        try {
            const qrImage = await qrcode.toDataURL(qrCodeData);
            res.json({ success: true, qr: qrImage });
        } catch (e) {
            res.json({ success: false, error: 'Erè jenerasyon QR' });
        }
    } else {
        res.json({ success: false, error: 'Pa gen QR Code disponib.' });
    }
});

// Lanse Bot la
startBot().catch(console.error);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Sèvè ap kouri sou port ${PORT}`);
    console.log(`📱 Louvri http://localhost:${PORT} pou konekte`);
});
