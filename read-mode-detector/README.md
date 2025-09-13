# Détecteur externe de la compatibilité au mode lecture pour Firefox
## Usage
- Dans un terminal/invite de commande, se rendre dans le répertoire où est stocké le script detect-reader-mode.js
- Lancer la commande : `node detect-reader-mode.js URL` où `URL` sera l'URL de la page à tester
- Le retour sera un booléen :
  - `true` : la page propose le mode lecture
  - `false` : la page est incompatible avec le mode lecture

## Limitations
La page est testée en dehors de tout contexte local de votre navigateur.

Elle ne peut donc en AUCUN cas tester une page pour laquelle une identification préalable est nécessaire.

## Installation
### Pré-requis
Disposer d'un node.js 22 ou plus sur le poste.
### Procédure d'installation
- Se rendre dans le répertoire où est stocké le package.json
- Exécuter les commandes
  - Installer les paquets nécessaires au fonctionnement de l'application : `npm install --ignore-scripts`
  - Installer les paquets nécessaires au fonctionnement de Firefox Headless : `npx playwright install`
