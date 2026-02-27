// server.js
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Sèvi ak dosye 'public' pou fichye HTML
app.use(express.static('public'));

async function startBot() {
    // 1. Jere otantifikasyon (sesyon an)
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    // 2. Kreye koneksyon an
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // Nou pap afiche nan terminal la, men nan browser la
    });

    // Soje kredansyèl yo chak fwa yo chanje
    sock.ev.on('creds.update', saveCreds);

    // 3. Lè koneksyon an ouvri
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            // Voye kòd QR la bay paj HTML a via Socket.io
            console.log("QR Code received, sending to client...");
            io.emit('qr', qr);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Koneksyon fèmen, rekonekte?", shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log("✅ Koneksyon reyisi!");
            io.emit('connected', true);
        }
    });

    sock.ev.on('messages.upsert', (m) => {
        console.log("Nouvo mesaj:", m);
    });
}

startBot();

// Lanse sèvè a
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Sèvè ap kouri sou: http://localhost:${PORT}`);
    console.log(`👉 Louvri lyen sa a nan browser ou pou wè QR kòd la.`);
});
