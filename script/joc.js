// DECLARAR OBJECTES

const nom = document.getElementById("nom");
const btnInstruccions = document.getElementById("btn-instruccions");
const gameBoard = document.getElementById("game-board");
const puntsLabel = document.getElementById("punts");
const bestPlayerLabel = document.getElementById("best-player");

// DECLARAR EVENTS

btnInstruccions.addEventListener("click", mostrarInstruccions);

// DECLARAR VARIABLES Y CONSTANTS

const broadcastChannel = new BroadcastChannel("joc_parelles");
const paraules = ["poma", "plàtan", "maduixa", "pera", "kiwi", "taronja", "mandarina", "llimona", "raïm", "cirera"];
const cartes = [...paraules, ...paraules]; // Duplica l'array paraules per tenir parelles
const nomCookie = document.cookie.split("=")[1]; // Agafem el valor després de "=" que és el nom del jugador
const nomStorage = localStorage.getItem("bestPlayer");
const highscoreStorage = localStorage.getItem("highscore");
let missatge = "";
let estatJoc = "";
let cartesSeleccionades = []; // Array on guardarem les dues cartes (parella) seleccionades
let parellesEncertades = 0;
let punts = 0;
let highscore = 0;
let win;
var bodyBgColor;
// Codi html per la finestra amb les instruccions del joc
// Volia provar el mètode window.open/write(), que ha acabat funcionant correctament
const htmlInstruccions = `
<!DOCTYPE html>
<html>
<head>
    <title>Instruccions del joc</title>
</head>
<body>
    <h1>Instruccions del Joc de les Parelles</h1>
    <p>- Aquest és un joc de memòria on has de trobar les parelles de cartes.</p>
    <p>- Fes clic sobre una carta per revelar-la, i després fes clic sobre una altra.</p>
    <p>- Si les dues cartes coincideixen, es quedaran revelades.</p>
    <p>- Si no coincideixen, es giraran de nou.</p>
    <p>- El joc acaba quan has trobat totes les parelles de cartes.<p/>
    <p>- Obteniu punts per cada parella trobada!</p>
    <button onclick="window.close()">Tanca la finestra</button>
</body>
</html>
`;

// FUNCIONALITAT

// Si existeix una partida començada, dona una alerta i tanca la finestra
// L'únic problema es que quan s'obre una nova pestanya de joc sobreescriu l'anterior i la borra també
if (localStorage.getItem("partidaComencada") != null) {
    alert("Hi ha una partida començada");
    window.close();
}

localStorage.setItem("partidaComencada", true); // Guardem l'info de que la partida ha començat
nom.textContent = nomCookie; // Mostrem el nom del jugador de la cookie al index.js
bestPlayerLabel.textContent = "JUGADOR: " + nomStorage + " - PUNTS: " + highscoreStorage; // Mostrem l'info del millor jugador al localstorage
estatJoc = "En joc"; // Canviem l'estat a joc. Aquest string serveix per actualitzar el missatge del broadcastchannel

actualitzarLabelPunts(); // Mostrem els punts. Aqui comença amb zero
cambiarColorDeFons(); // Cambiem el color de fons segons el navegador
crearCartes(); // Creem les cartes amb un bucle foreach
actualitzarBroadcastChannel(); // Actualitzem el missatge amb la info del jugador, punts i estat de joc

// Funció que obra una finestra amb les instruccions del joc
function mostrarInstruccions() {
    win = window.open("", "", "width=400,height=400"); // Obre una nova finestra 400x400px
    win.document.write(htmlInstruccions); // Escribim l'html dins d'aquesta nova finestra
    win.document.close(); // Aquest mètode acaba d'escriure el document obert amb .open()
}

// Funció que crea les cartes dinàmicament com a botons per afegir-los a l'html
function crearCartes() {
    cartes.forEach(valor => { // Fem un bucle per cada valor de l'array de parelles de paraules (cartes)
        const carta = document.createElement("button"); // Creem l'element botó
        carta.style.backgroundColor = "blue"; // De color blau
        carta.style.borderRadius = "10px";
        carta.textContent = valor;
        carta.style.color = "blue"; // El text (la paraula) del mateix color, per a que sembli "amagada"
        carta.addEventListener("click", () => girarCarta(carta)); // Funció arrow per que s'executi només al prémer el botó
        gameBoard.appendChild(carta); // Afegim la carta a un div grid 5x4 a l'html
      });
}

// Funció que s'executa al prémer el botó carta per canviar el color i mostrar la paraula amagada
function girarCarta(carta) {
    carta.disabled = true;
    carta.style.backgroundColor = "grey";
    carta.style.color = "white";
    cartesSeleccionades.push(carta); // Guardem la carta girada a l'array de parelles de cartes amb .push()

    if (cartesSeleccionades.length === 2) { // Quan tenim dues cartes girades, comproven si coincideixen en la paraula
        comprovarCoincidencia();
    }
}

// Funció que comprova si dues cartes coincideixen
function comprovarCoincidencia() {
    const [carta1, carta2] = cartesSeleccionades;
    if (carta1.textContent === carta2.textContent) { // Si coincideixen
        punts += 10; // sumem 10 punts
        actualitzarLabelPunts(); // Actualitzem punts al label local
        parellesEncertades++; // Comptem les parelles encertades per saber quan s'acaba el joc
        actualitzarBroadcastChannel(); // Actualitzem els punts a l'index.html

        if (parellesEncertades == paraules.length) finalitzaJoc(); // Si hem encertat totes les parelles, s'acaba el joc
    } else {
        setTimeout(() => {  // Si no hem encertat la parella, donem un segon de marge per a que el jugador pugui memoritzar les cartes
            carta1.disabled = false;
            carta2.disabled = false;
            carta1.style.backgroundColor = "blue";
            carta2.style.backgroundColor = "blue";
            carta1.style.color = "blue";
            carta2.style.color = "blue";
    
            punts -= 3; // Restem 3 punts
            if (punts < 0) punts = 0;

            actualitzarLabelPunts(); // Actualitzem punts al label local
            actualitzarBroadcastChannel(); // Actualitzem els punts a l'index.html
        }, 1000);
    }
    cartesSeleccionades = []; // Netejem l'array per a la próxima parella de cartes
}

// Funció que canvia l'estat del joc a finalitzat, actualitza el highscore i redirecciona a la pantalla de joc finalitzat
function finalitzaJoc() {
    estatJoc = "Partida finalitzada";
    actualitzarBroadcastChannel(); // Actualitzem el label de l'index.html per mostrar al jugador que la partida ha finalitzat

    if (punts > highscore) { // Si els punts son més grans que el highscore, guardem les dades del millor jugador amb localstorage
        highscore = punts;
        localStorage.setItem("bestPlayer", nom.textContent);
        localStorage.setItem("highscore", highscore);
    }

    window.location.assign("jocFinalitzat.html", "_self"); // Redireccionem la pestanya a l'html de joc finalitzat
}

// Funció que cambia el color de fons segons el tipus de navegador, el mateix que l'index.html
function cambiarColorDeFons() {
    if (navigator.userAgent.includes("Chrome")) {
        bodyBgColor = "#a4eda5";
        document.body.style.backgroundColor = bodyBgColor;
    } else {
        bodyBgColor = "orange";
        document.body.style.backgroundColor = bodyBgColor;
    }
    
    // Guardem el color amb sessionstorage ja que només volem el color per la pestanya de joc finalitzat
    sessionStorage.setItem("color", bodyBgColor); 
}

// Funció que envia el missatge amb el nom, punts i estat de partida a l'index.html amb broadcastchannel
function actualitzarBroadcastChannel() {
    missatge = "NOM: " + nom.textContent + ", PUNTS: " + punts + ", ESTAT PARTIDA: " + estatJoc;
    broadcastChannel.postMessage(missatge);
}

// Funció que actualitza la label local de joc.html amb els punts guanyats
function actualitzarLabelPunts() {
    puntsLabel.textContent = "Punts: " + punts.toString();
}