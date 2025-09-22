const fs = require('fs');
const os = require('os');
const path = require('path');
const {execSync} = require('child_process');

const APP_NAME = 'com.example.active_tab';
const ALLOWED_EXT = 'native-demo@example.com'; // extension ID from manifest
const scriptDir = path.resolve(__dirname);
const hostScript = path.join(scriptDir, 'native_host.js');

if (!fs.existsSync(hostScript)) {
    console.error('native_host.js introuvable dans', scriptDir);
    process.exit(1);
}

/**
 * Installe le script sur un système Unix
 */
function installLinux() {
    const homedir = os.homedir();
    const targetDir = path.join(homedir, '.mozilla', 'native-messaging-hosts');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, {recursive: true});
    }

    const wrapper = path.join(scriptDir, 'native_host.sh');
    const nodeBin = process.execPath; // Chemin vers l'exécutable node qui fait tourner le script
    const wrapperContent = `#!/bin/bash
exec "${nodeBin}" "${hostScript}"
`;
    fs.writeFileSync(wrapper, wrapperContent, {mode: 0o755});

    const manifest = {
        name: APP_NAME,
        description: "Hôte natif généré par install.js",
        path: wrapper,
        type: "stdio",
        allowed_extensions: [ALLOWED_EXT]
    };
    const manifestPath = path.join(targetDir, APP_NAME + '.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Installation du manifeste de l\'app native :', manifestPath);
}

/**
 * Installe le script sur un système Windows
 */
function installWindows() {
    const manifestPath = path.join(scriptDir, APP_NAME + '.json');
    const wrapper = path.join(scriptDir, 'native_host.bat');
    // try to detect node.exe location
    let nodeExe = process.execPath;
    // create wrapper .bat
    const batContent = `@echo off
"%NODE_EXE%" "%SCRIPT%"
`.replace('%NODE_EXE%', nodeExe).replace('%SCRIPT%', hostScript);
    fs.writeFileSync(wrapper, batContent, {mode: 0o644});

    const manifest = {
        name: APP_NAME,
        description: "Hôte natif généré par install.js",
        path: wrapper,
        type: "stdio",
        allowed_extensions: [ALLOWED_EXT]
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Manifeste écrit à ', manifestPath);

    // Write registry key under HKCU
    const regKey = 'HKCU\\Software\\Mozilla\\NativeMessagingHosts\\' + APP_NAME;
    const cmd = `REG ADD "${regKey}" /ve /t REG_SZ /d "${manifestPath}" /f`;
    try {
        execSync(cmd, {stdio: 'inherit'});
        console.log('Clé de registre à ajouter :', regKey);
    } catch (e) {
        console.error('Erreur d\{écriture de la clé de registre. Lancez install.js en tant qu\'administrateur ou créez la clé de registre manuellement.');
        console.error('Commande tentée :', cmd);
    }
}

const platform = os.platform();
if (platform === 'linux' || platform === 'freebsd') {
    installLinux();
} else if (platform === 'win32') {
    installWindows();
} else {
    console.error('OS non pris en charge par ce script:', platform);
    process.exit(2);
}

console.log('Installation terminée. Chargez l\'extension dans about:debugging#/runtime/this-firefox et testez.');
