const fs = require('fs');

/**
 * Lit le message depuis le service de native messaging
 * @returns {any|null} - Renvoi une valeur ou null en fonction de ce qu'il arrive à lire
 */
function readMessage() {
    const header = Buffer.alloc(4);
    let bytesRead = 0;
    try {
        bytesRead = fs.readSync(0, header, 0, 4);
    } catch (e) {
        // stdin closed or error
        return null;
    }
    if (bytesRead === 0) return null;
    const msgLen = header.readUInt32LE(0);
    const msgBuf = Buffer.alloc(msgLen);
    fs.readSync(0, msgBuf, 0, msgLen);
    try {
        return JSON.parse(msgBuf.toString('utf8'));
    } catch (e) {
        console.error('Invalid JSON from extension:', e);
        return null;
    }
}

/**
 * Envoi le message souhaité via le service de native messaging
 * @param {object | string | number} msg - Message à transmettre
 */
function sendMessage(msg) {
    const s = JSON.stringify(msg);
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32LE(Buffer.byteLength(s), 0);
    fs.writeSync(1, lenBuf);
    fs.writeSync(1, s);
}

console.error('Native host started');

// Boucle principale (pour garder le système actif)
while (true) {
    const msg = readMessage();

    // Si pas de message, on s'arrête
    if (!msg) break;

    // Gestion du message reçu
    if (msg.type === 'active_tab') {
        // On fera ici les actions souhaitées (vérifier si le mode lecture est possible)

        // Renvoi le message reçu en indiquant un timestamp (exemple)
        sendMessage({ok: true, received: msg, time: Date.now()});
    } else {
        // Renvoi le message reçu en indiquant que ce n'est pas la bonne action (exemple)
        sendMessage({ok: false});
    }
}

console.error('Native host exiting');
