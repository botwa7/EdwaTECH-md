const https = require('https');
const config = require('../config');

async function run(sock, from, msg, args, config) {
    await sock.sendMessage(from, { text: '🔍 *Ap verifye mizajou...*'});

    const repoOwner = 'botwa7'; // Chanje si non itilizatè GitHub ou diferan
    const repoName = 'EdwaTECH-md';
    
    // URL pou jwenn dènye vèsyon an depi GitHub API
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
        let data = '';

        res.on('data', (chunk) => { data += chunk; });
        
        res.on('end', async () => {
            try {
                const latestRelease = JSON.parse(data);
                const latestVersion = latestRelease.tag_name.replace('v', ''); // Egzanp: "2.1.0"
                const currentVersion = config.VERSION;
                const changelog = latestRelease.body || "Pa gen detay.";

                if (latestVersion === currentVersion) {
                    await sock.sendMessage(from, { 
                        text: `✅ *Bot la deja ajou!* \n\nVèsyon aktyèl: ${currentVersion}\nOu gen dènye vèsyon an.` 
                    });
                } else {
                    const updateMsg = `
🆕 *NOUVO VÈSYON DISPONIB!*

📦 *Vèsyon Aktyèl:* ${currentVersion}
🚀 *Dènye Vèsyon:* ${latestVersion}

📝 *Chanjman yo:*
${changelog}

⚠️ *ENSTRIKSYON POU METE AJOU:*
Si w sou Termux:
1. Fèmen bot la (CTRL+C)
2. Tape: git pull
3. Tape: npm install
4. Tape: node index.js

Si w sou Panel:
1. Ale nan Files
2. Klike sou "Pull Updates" oswa re-upload fichye yo.
3. Rekòmanse bot la.

🔗 *Lyen Download:* ${latestRelease.html_url}
                    `.trim();

                    await sock.sendMessage(from, { text: updateMsg });
                }
            } catch (error) {
                await sock.sendMessage(from, { text: '❌ Erè pandan m t ap tcheke mizajou a. Verifye koneksyon entènèt ou.' });
                console.error(error);
            }
        });
    }).on('error', async (err) => {
        await sock.sendMessage(from, { text: '❌ Erè koneksyon ak GitHub.' });
        console.error(err);
    });
}

module.exports = { run };
