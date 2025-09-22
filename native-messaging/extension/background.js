/**
 * Script tournant en tâche de fond dans Firefox pour réagir à chaque changement d'onglet
 * @type {null}
 */
let port = null;
const connectRetryDelay = 2000;

// On établi la connexion avec l'app native
function connect() {
    try {
        port = browser.runtime.connectNative("com.example.active_tab");
    } catch (e) {
        console.error("Impossible de se connecter au host natif :", e);
        return;
    }

    port.onMessage.addListener((msg) => {
        console.log("Message de l'app native :", msg);
        // On traitera ici le retour de l'appli côté hôte
        // Lire un message indiquant si oui ou non la page est compatible, passage en mode lecture, ...
    });

    port.onDisconnect.addListener(() => {
        console.warn("Déconnecté du host natif", browser.runtime.lastError);
        // essayer de se reconnecter plus tard
        setTimeout(connect, connectRetryDelay);
    });
}

/**
 * Envoi les informations concernant l'onglet actif
 * @returns {Promise<void>}
 * @async
 */
async function sendActiveTab(e) {
    if (!port) {
        console.error('no connection')
        return;
    }
    try {
        const tabs = await browser.tabs.query({active: true, currentWindow: true});
        if (tabs.length === 0) return;

        const tab = tabs[0];

        // On arrête s'il n'y a pas d'URL
        if((tab.url || null) === null) {
            return;
        }

        // On arrête si l'URL est déjà en mode lecture
        if(tab.url.startsWith('about:reader?url=')) {
            console.info(tab.url, tab.title, 'Déjà en mode lecture');
            return;
        }

        console.info('Interrogation de l\'app native', tab.url, tab.title, Date.now());

        // On envoi les informations nécessaires à l'app native
        port.postMessage({
            type: "active_tab",
            url: tab.url,
            title: tab.title || null,
            id: tab.id,
            timestamp: Date.now()
        });
    } catch (e) {
        console.error("Erreur lors de l'envoi de l'onglet actif :", e);
    }
}

// On se connecte
connect();
browser.tabs.onActivated.addListener(sendActiveTab);
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // si l'onglet mis à jour est l'actif, envoie
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (tabs && tabs[0] && tabs[0].id === tabId && changeInfo.status === 'complete') {
            sendActiveTab();
        }
    }).catch(() => {
    });
});
browser.browserAction.onClicked.addListener(sendActiveTab);
