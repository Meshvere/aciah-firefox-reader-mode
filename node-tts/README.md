# Vocalisation de chaînes de caractères
## Usage
### Vérification de fonctionnement
- Dans un terminal/invite de commande, se rendre dans le répertoire où est stocké le script tts.js
- Lancer la commande : `node index.js`
- Si un vocalisateur est disponible sur votre poste, il lira les phrases une par une en attendant que la précédente aient terminée.
### Utilisation en "API"
- Dans un terminal/invite de commande, se rendre dans le répertoire où est stocké le script tts.js
- Lancer la commande : `node vocalize-it.js "Phrase 1" ["Phrase 2", "Phrase X"...]`
### Utilisation dans un script
- Copier le fichier tts.js dans votre projet
- L'inclure dans votre script JS en fonction des besoins
  - `import {speak} from "./tts.js";` : uniquement la fonction mono phrase
  - `import {speakAll} from "./tts.js";` : uniquement la fonction multiphrase
  - `import {speak, speakAll} from "./tts.js";` : les deux méthodes
- La fonction speak attend une chaîne de caractères
- La fonction speakAll attend un tableau de chaînes de caractères (de 1 à X)

## Limitations
Certains vocalisateurs n'attendent pas forcément la fin de la vocalisation avant d'indiquer que le traitement est terminé.
Le résultat de la vocalisation dépendra des paramètrages de votre vocalisateur.

## Installation
### Pré-requis
- Disposer d'un node.js 22 ou plus sur le poste.
- Disposer d'un vocalisateur sur le poste.
### Procédure d'installation
- Aucune action nécessaire
