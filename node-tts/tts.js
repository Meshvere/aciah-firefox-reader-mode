// tts.js
import {exec} from "child_process";
import os from "os";

/**
 * Construit la commande de vocalisation en fonction de l'OS.
 * @param text - Texte à vocaliser
 * @returns {string} - Commande à lancer
 */
function buildCommand(text) {
    const escaped = text.replace(/'/g, '').replace(/"/g, '\\"');
    switch (os.platform()) {
        case "linux":
            return `command -v spd-say >/dev/null 2>&1 && spd-say "${escaped}" || espeak "${escaped}"`;
        case "darwin":
            return `say "${escaped}"`;
        case "win32":
            return `powershell -c "Add-Type -AssemblyName System.Speech; ` +
                `(New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${escaped}')"`;
        default:
            throw new Error(`Plateforme non supportée : ${os.platform()}`);
    }
}

/**
 * Vocalise une chaîne de caractères
 * @param text - Chaîne à vocaliser
 * @returns {Promise<unknown>} - Promesse de vocalisation à résoudre (permet d'attendre la fin de la vocalisation avant de faire une autre action)
 */
export async function speak(text) {
    if (text === undefined) {
        text = '';
    }

    text = text.trim();

    // Si texte vide, on ne lance pas de vocalisation
    if (text === '') {
        console.error('Aucune phrase à vocaliser');

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    return new Promise((resolve, reject) => {
        // On génère la commande
        const cmd = buildCommand(text);

        // On lance la commande
        const child = exec(cmd, (error) => {
            if (error) reject(error);
            else resolve();
        });

        // En cas de log/debug :
        // child.stdout?.on("data", (d) => console.log(d.toString()));
        // child.stderr?.on("data", (d) => console.error(d.toString()));
    });
}

/**
 * Vocalise un ensemble de chaînes de caractères, l'une après l'autre.
 * @param texts - Chaînes de caractères à vocaliser
 * @returns {Promise<void>} - Promesse de vocalisation à résoudre (permet d'attendre la fin de la vocalisation avant de faire une autre action)
 */
export async function speakAll(texts) {
    for (const text of texts) {
        await speak(text);
    }
}
