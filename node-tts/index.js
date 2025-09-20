import {speak, speakAll} from "./tts.js";

await speak('')

// Vocalise plusieurs chaînes de caractères
await speakAll([
    "Bonjour",
    "Je vais lire plusieurs phrases",
    "Chaque phrase attend la précédente"
]);

// Vocalise une chaîne de caractère
await speak("Et là, je vais en lire une seule");
