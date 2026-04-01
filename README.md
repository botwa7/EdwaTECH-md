## 📄 **README.MD KONPLÈ **

```markdown
# 🤖 EdwaTECH-md

<div align="center">

![WhatsApp Bot](https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Baileys](https://img.shields.io/badge/Baileys-Latest-00ff88?style=for-the-badge&logo=github&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-GPL--2.0-orange?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/botwa7/EdwaTECH-md?style=for-the-badge&color=yellow)

**Bot WhatsApp Nouvelle Génération - Puissant, Rapide et Fiable**

[![Déployer](https://img.shields.io/badge/Déployer-sur_Termux-000000?style=for-the-badge&logo=terminal&logoColor=white)](#installation)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/botwa7/EdwaTECH-md)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VaX7FVI2Jl8Ek9Ce383k)
[![Support](https://img.shields.io/badge/Support-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/message/LVB523ITVYMCF1)

</div>

---

## 📋 Table des Matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [📦 Installation](#-installation)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🔧 Configuration](#-configuration)
- [📜 Commandes Disponibles](#-commandes-disponibles)
- [🌐 Déploiement](#-déploiement)
- [🔐 Session Web](#-session-web)
- [🤝 Contribuer](#-contribuer)
- [📝 Changelog](#-changelog)
- [❓ FAQ](#-faq)
- [🔒 Sécurité](#-sécurité)
- [👨‍ Crédits](#-crédits)
- [📞 Support](#-support)
- [📄 Licence](#-licence)

---

## ✨ Fonctionnalités

### 🔐 Authentification
- ✅ **Pairing Code** - Connexion rapide avec code
- ✅ **QR Code** - Scan traditionnel
- ✅ **Session Web** - Interface de génération en ligne

### 🛡️ Sécurité & Automatisation
- 🛡️ **Anti-Suppression** - Récupère les messages supprimés
- 👁️ **Anti-ViewOnce** - Sauvegarde les médias éphémères
- ❤️ **Auto-Status** - Réagit automatiquement aux statuts
- 🎤 **Auto-Recording** - Simule l'enregistrement audio

### 👥 Gestion de Groupe
- 🔒 Administration complète (promouvoir, rétrograder, exclure)
- 🔗 Anti-lien & Anti-mots interdits
- 📢 Messages de bienvenue et d'au revoir
- 🏷️ Tag tous les membres / Tag caché
- 📊 Informations du groupe

### 🎯 Autres Fonctionnalités
- ⚡ Rapide et léger
- 🔄 Mises à jour automatiques
- 💾 Sauvegarde automatique des sessions
- 🌐 Interface web élégante
- 📱 Compatible Termux, Render, VPS

---

## 📦 Installation

### Prérequis
- [Node.js](https://nodejs.org/) version 16 ou supérieure
- [Git](https://git-scm.com/)
- Un compte WhatsApp

### Sur Termux (Android) - RECOMMANDÉ

```bash
# Mettre à jour les paquets
pkg update && pkg upgrade

# Installer Git et Node.js
pkg install git nodejs -y

# Cloner le dépôt
git clone https://github.com/botwa7/EdwaTECH-md.git
cd EdwaTECH-md

# Installer les dépendances
npm install

# Lancer le bot
node index.js
```

### Sur Render

```bash
# Cloner le dépôt
git clone https://github.com/botwa7/EdwaTECH-md.git
cd EdwaTECH-md

# Installer les dépendances
npm install

# Lancer le bot
node index.js
```

### Sur PC (Windows/Linux/Mac)

```bash
# Ouvrir un terminal et exécuter :
git clone https://github.com/botwa7/EdwaTECH-md.git
cd EdwaTECH-md
npm install
node index.js
```

---

## 🚀 Démarrage Rapide

1. **Lancez le bot** :
   ```bash
   node index.js
   ```

2. **Choisissez votre méthode de connexion** :
   ```
   📱 === PAIRING CODE AUTHENTICATION ===
   1. Pairing Code (Recommandé)
   2. QR Code
   Choisissez : 1
   ```

3. **Entrez votre numéro** :
   ```
   Entrez le numéro WhatsApp (exemple: 50948887766) :
   ```

4. **Copiez le code** affiché et entrez-le dans WhatsApp :
   - WhatsApp → Paramètres → Appareils connectés
   - "Connecter avec un numéro de téléphone"
   - Entrez le code

5. **C'est connecté !** 🎉

---

## 🔧 Configuration

Ouvrez le fichier `config.js` et modifiez les valeurs :

```javascript
module.exports = {
    BOT_NAME: "Edwa-md 🇭🇹",           // Nom du bot
    OWNER_NAME: "BOSS 『E』『d』『w』『a』", // Votre nom
    OWNER_NUMBER: "50943099723",        // VOTRE numéro (sans +)
    OWNER_LINK: "https://wa.me/message/LVB523ITVYMCF1",    // Lien WhatsApp
    CHANNEL_LINK: "https://whatsapp.com/channel/0029VaX7FVI2Jl8Ek9Ce383k",        // Lien Channel
    REPO_LINK: "https://github.com/botwa7/EdwaTECH-md",
    PREFIX: ".",                        // Préfixe des commandes
    MODE: "public",                     // 'public' ou 'private'
    VERSION: "2.1.0",
    USE_PAIRING_CODE: true,             // true = Pairing Code
    
    // Fonctionnalités auto
    AUTO_STATUS_REACT: true,
    AUTO_RECORDING: true,
    ANTI_VIEW_ONCE: true,
    ANTI_DELETE: true,
    
    // Liste des plugins
    PLUGINS_LIST: [
        "menu", "ping", "owner", "repo", "save", "warn", "update",
        "promote", "demote", "kick", "add", "antilink",
        "welcome", "goodbye", "hidetag", "tagall",
        "setppgroup", "setdesc", "close", "open",
        "groupinfo", "antibadword"
    ]
};
```

---

## 📜 Commandes Disponibles

### 📱 Menu & Info
| Commande | Description |
|----------|-------------|
| `.menu` | Affiche le menu complet |
| `.ping` | Teste la vitesse du bot |
| `.repo` | Lien du dépôt GitHub |
| `.owner` | Informations du propriétaire |
| `.update` | Vérifie les mises à jour |

### 👥 Groupe
| Commande | Description |
|----------|-------------|
| `.promote @user` | Promouvoir un membre |
| `.demote @user` | Rétrograder un admin |
| `.kick @user` | Exclure un membre |
| `.add <numéro>` | Ajouter un membre |
| `.antilink on/off` | Activer/désactiver anti-lien |
| `.antibadword on/off` | Activer/désactiver anti-insultes |
| `.welcome on/off` | Message de bienvenue |
| `.goodbye on/off` | Message d'au revoir |
| `.hidetag <msg>` | Tag sans notification |
| `.tagall` | Tag tous les membres |
| `.setppgroup` | Changer photo de groupe |
| `.setdesc <texte>` | Changer description |
| `.close` | Fermer le groupe (admins only) |
| `.open` | Ouvrir le groupe |
| `.groupinfo` | Infos du groupe |

### 👑 Owner
| Commande | Description |
|----------|-------------|
| `.warn @user` | Avertir un utilisateur |
| `.save` (répondre) | Sauvegarder média en privé |

---

## 🌐 Déploiement

### Sur Termux (Recommandé)

```bash
# 1. Cloner et installer
pkg update && pkg upgrade
pkg install git nodejs -y
git clone https://github.com/botwa7/EdwaTECH-md.git
cd EdwaTECH-md
npm install

# 2. Lancer le bot
node index.js

# 3. Pour garder le bot actif, utilisez termux-wake-lock
termux-wake-lock
```

### Sur Render

1. **Créez un compte** sur [render.com](https://render.com)
2. **Cliquez sur "New +"** → **"Web Service"**
3. **Connectez votre GitHub** et sélectionnez le repo
4. **Configuration** :
   - **Build Command** : `npm install`
   - **Start Command** : `node index.js`
   - **Instance Type** : Free
5. **Déployez** et attendez
6. **Accédez au site** : `https://votre-app.onrender.com`

### Sur VPS

```bash
# Cloner et installer
git clone https://github.com/botwa7/EdwaTECH-md.git
cd EdwaTECH-md
npm install

# Utiliser PM2 pour garder le bot actif
npm install -g pm2
pm2 start index.js --name Edwa-MD
pm2 save
pm2 startup

# Voir les logs
pm2 logs Edwa-MD
```

---

## 🔐 Session Web

Le bot inclut une **interface web élégante** pour générer les sessions :

### Accès
- **Local** : `http://localhost:3000`
- **Render** : `https://votre-app.onrender.com`
- **VPS** : `http://VOTRE_IP:3000`

### Fonctionnalités
- 🎨 Design moderne et responsive
- 📱 Génération de Pairing Code en un clic
- 📷 Affichage QR Code en temps réel
- 🟢 Statut du bot en direct
- 🔒 Sécurisé et facile à utiliser

---

## 🤝 Contribuer

Nou tout akeyi pou ede amelyore pwojè a! Men kijan:

1. **Fork** pwojè a
2. **Kreye yon branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit chanjman yo** (`git commit -m 'Add some AmazingFeature'`)
4. **Push** (`git push origin feature/AmazingFeature`)
5. **Ouvri yon Pull Request**

---

## 📝 Changelog

### Version 2.1.0 (Aktuel)
- ✅ Ajoute interface web pou session
- ✅ Anti-delete mesaj
- ✅ Anti-viewonce
- ✅ Auto-status react
- ✅ 21 plugins disponib
- ✅ Sistèm update otomatik
- ✅ Pairing Code fonctionnel

### Version 2.0.0
- 🚀 Migrasyon vèsyon Baileys
- 🔧 Amelyore pèfòmans
- 🐛 Korije bug

---

## ❓ FAQ (Foire Aux Questions)

**Q: Èske bot la gratis?**  
R: Wi, 100% gratis ak open-source!

**Q: Kijan pou m mete ajou bot la?**  
R: Tape `.update` nan WhatsApp oswa fè `git pull` sou Termux.

**Q: Èske m ka itilize bot la sou plizyè nimewo?**  
R: Non, yon sèl nimewo WhatsApp pou chak enstans.

**Q: Kisa m fè si bot la pa reponn?**  
R: Tcheke koneksyon entènèt la, rekòmanse bot la, oswa kontakte sipò a.

**Q: Pairing Code la pa mache, kisa pou m fè?**  
R: Eseye QR Code la, oswa tann 10 minit anvan w eseye ankò.

**Q: Èske m bezwen yon PC?**  
R: Non, ou ka itilize Termux sou telefòn Android ou.

---

## 🔒 Sécurité

- 🔐 Pa janm pataje session ID ou ak pèsonn
- 🔐 Chanje OWNER_NUMBER nan `config.js`
- 🔐 Itilize yon modpas fò si w deplwaye sou VPS
- 🔐 Pa pataje lyen session web la piblikman
- 🔐 Fè backup regilye nan dossier `auth/`

---

## 👨‍💻 Crédits

<div align="center">

**Développé avec ❤️ par Boss Edwa**

[![GitHub](https://img.shields.io/badge/GitHub-botwa7-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/botwa7)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Contact-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/message/LVB523ITVYMCF1)

</div>

### Bibliothèques Utilisées
- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [Express](https://expressjs.com/) - Serveur Web
- [QRCode](https://www.npmjs.com/package/qrcode) - Génération QR

---

## 📞 Support

### Besoin d'aide ?

- 📖 **Documentation** : Lisez ce README
- 💬 **Channel WhatsApp** : [Rejoindre](https://whatsapp.com/channel/0029VaX7FVI2Jl8Ek9Ce383k)
- 🐛 **Bug Report** : [Ouvrir une issue](https://github.com/botwa7/EdwaTECH-md/issues)
- 📧 **Contact Direct** : [WhatsApp Owner](https://wa.me/message/LVB523ITVYMCF1)
- 🎥 **Tutoriels** : Abòne nan channel la

---

## 📄 Licence

<div align="center">

**GPL-2.0 License**

Ce projet est open-source et distribué sous licence GPL-2.0.  
Vous êtes libre de l'utiliser, modifier et distribuer.

⚠️ **Note** : Ce bot est à usage éducatif. Les développeurs ne sont pas responsables d'une utilisation abusive.

</div>

---

<div align="center">

### ⭐ N'oubliez pas de mettre une étoile si vous aimez le projet !

**Made with 🇭 by Boss Edwa**

[![GitHub stars](https://img.shields.io/github/stars/botwa7/EdwaTECH-md?style=social)](https://github.com/botwa7/EdwaTECH-md/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/botwa7/EdwaTECH-md?style=social)](https://github.com/botwa7/EdwaTECH-md/network/members)

</div>
```

