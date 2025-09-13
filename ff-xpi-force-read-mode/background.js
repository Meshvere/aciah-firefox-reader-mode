// Fonction pour activer le mode lecture si l'onglet n'y est pas déjà
async function ensureReaderMode(tab) {
    console.log(tab.url, tab.title)
    try {
        // Vérifie si l'URL est déjà en mode lecture
        if (!tab.url.startsWith("about:reader")) {
            const result = await chrome.tabs.toggleReaderMode(tab.id);
            if (result) {
                console.log(`Mode lecture activé pour : ${tab.url}`);
            } else {
                console.log(`Mode lecture non disponible pour : ${tab.url}`);
            }
        } else {
            console.log(`Onglet déjà en mode lecture : ${tab.url}`);
        }
    } catch (err) {
        console.error("Erreur activation mode lecture :", err);
    }
}

// Écoute les onglets chargés
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        ensureReaderMode(tab);
    }
});
