# Native Messaging Demo — Active Tab (Firefox + Node)

## Contenu:
 - extension/manifest.json
 - extension/background.js
 - native_host.js
 - install.js  (cross-platform installer)

## Objectif:
  Démonstrateur d'une extension Firefox qui envoie l'onglet actif au host natif Node via Native Messaging.

## Instructions (Linux):
 1. Copier le dossier sur la machine cible.
 2. `node install.js`  (crée le manifest dans ~/.mozilla/native-messaging-hosts/ ... et un wrapper)
 3. Ouvrir Firefox -> about:debugging#/runtime/this-firefox -> "Load Temporary Add-on" -> sélectionner extension/manifest.json
 4. Cliquer sur l'icône de l'extension ou changer d'onglet ; native_host.js devrait recevoir JSON et répondre.
 5. Logs: native_host.js écrit les logs de debug sur stderr; responses sont envoyées via stdout au navigateur.

## Instructions (Windows):
 1. Copier le dossier sur la machine cible.
 2. Ouvrir une console Administrateur (requis pour écrire dans le registre si nécessaire).
 3. `node install.js` (écrit le manifest à côté des fichiers et ajoute la clé HKCU\Software\Mozilla\NativeMessagingHosts\com.example.active_tab)
 4. Ouvrir Firefox -> about:debugging#/runtime/this-firefox -> "Load Temporary Add-on" -> sélectionner extension/manifest.json
 5. Tester en cliquant sur l'icône.

## Remarques:
 - L'ID d'extension (applications.gecko.id) est "native-demo@example.com".
   Ce même identifiant est référencé dans `install.js` pour la clé `allowed_extensions`.
   Pour les tests, si tu préfères, tu peux remplacer allowed_extensions par ["*"] dans le manifest installé.
 - Ne pas utiliser console.log dans native_host.js car stdout est le canal de messagerie.
 - Le script install.js tente d'ajouter la clé de registre Windows (HKCU). Si cela échoue, crée la clé manuellement.
 - Pour production : signer l'extension, déployer le manifest sur les machines cibles et sécuriser allowed_extensions.
