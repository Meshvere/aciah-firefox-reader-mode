import {speakAll} from "./tts.js";

let strings = process.argv;
// Retire les deux premiers arguments (logiciel exécuteur du script, URI du script)
strings.splice(0, 2);

strings = strings.filter(x => {
    x = x.trim();

    return x !== undefined && x !== "";
});

if(strings.length === 0) {
    console.error('USAGE : vous devez passer au moins un mot ou phrase en paramètre de la commande');
    console.error('node vocalize-it.js "Première phrase" ["Deuxième phrase", "Troisième phrase", ...]')

    process.exit();
}

speakAll(strings);
