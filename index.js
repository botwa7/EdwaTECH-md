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
app.use(express.static('public')); // Sèvi ak katab public la

// Voye session.html dirèkteman lè moun ale sou racine la
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
            pairingCodeData = null; // Reset pairing code si QR parèt
            io.emit('qr_update', qr); // Notify frontend
        }

        if (pairingCode) {
            pairingCodeData = pairingCode;
            qrCodeData = null; // Reset QR si Pairing Code parèt
            io.emit('pairing_update', pairingCode); // Notify frontend
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
}

// API pou Status
app.get('/api/status', (req, res) => {
    const status = sock && sock.user ? 'connected' : 'disconnected';
    res.json({ status });
});

// API pou Pairing Code (Lè itilizatè antre nimewo)
app.post('/api/pair', async (req, res) => {
    const { phone } = req.body;
    
    if (!sock || !phone) {
        return res.json({ success: false, error: 'Bot la pa pare oswa nimewo manke.' });
    }
    try {
        // Si deja genyen yon pairing code, retounen l
        if (pairingCodeData) {
            return res.json({ success: true, code: pairingCodeData });
        }

        // Sinon, mande nouvo kod la (Sa a mande pou bot la rekòmanse ak nimewo a)
        // Note: Nan Baileys, pairing code la jeneré otomatikman nan 'connection.update'
        // Nou dwe atann li parèt. Pou senplifye, nou retounen sa ki genyen an oswa erè.
        
        // Astus: Si pa gen kod ankò, nou fòse rejenerasyon (si logic Baileys la pèmèt)
        // Men pi souvan, li parèt tout seul apre inisyализasyon.
        
        if (pairingCodeData) {
             res.json({ success: true, code: pairingCodeData });
        } else {
             // Si pa gen kod touswit, di itilizatè a tann yon ti kras epi refresh
             res.json({ success: false, error: 'Ap jeneré kod la... Tanpri reklike sou bouton an nan 5 segonn.' });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// API pou QR Code (Retounen imaj QR la)
app.get('/api/qr', async (req, res) => {
    if (qrCodeData) {
        try {
            const qrImage = await qrcode.toDataURL(qrCodeData);
            res.json({ success: true, qr: qrImage });
        } catch (e) {
            res.json({ success: false, error: 'Erè jenerasyon QR' });
        }
    } else {
        res.json({ success: false, error: 'Pa gen QR Code disponib kounye a.' });
    }
});

// Lanse Bot la
startBot().catch(console.error);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Sèvè ap kouri sou: http://localhost:${PORT}`);
    console.log(`📱 Louvri http://localhost:${PORT} pou wè paj Session Generator la.`);
});
