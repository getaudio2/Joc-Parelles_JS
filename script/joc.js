// DECLARAR OBJECTES

const nom = document.getElementById("nom");
const btnInstruccions = document.getElementById("btn-instruccions");
const gameBoard = document.getElementById("game-board");
const puntsLabel = document.getElementById("punts");
//const nomStorage = localStorage.getItem("nom");
const nomStorage = document.cookie.split("=")[1];

// DECLARAR EVENTS

btnInstruccions.addEventListener("click", mostrarInstruccions);

// DECLARAR VARIABLES Y CONSTANTS

const bc = new BroadcastChannel("joc_parelles");
const paraules = ["poma", "plàtan", "maduixa", "pera", "kiwi", "taronja", "mandarina", "llimona", "raïm", "cirera"];
const cartes = [...paraules, ...paraules];
let cartesSeleccionades = [];
let parellesEncertades = 0;
let punts = 0;
let win;
var bodyBgColor;
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

function mostrarInstruccions() {
    win = window.open("", "", "width=400,height=400");
    win.document.write(htmlInstruccions);
    win.document.close();
}

function crearCartes() {
    cartes.forEach(valor => {
        const carta = document.createElement("button");
        carta.style.backgroundColor = "blue";
        carta.style.borderRadius = "10px";
        carta.textContent = valor;
        carta.style.color = "blue";
        carta.addEventListener("click", () => girarCarta(carta));
        gameBoard.appendChild(carta);
      });
}

function girarCarta(carta) {
    carta.disabled = true;
    carta.style.backgroundColor = "grey";
    carta.style.color = "white";
    cartesSeleccionades.push(carta);

    if (cartesSeleccionades.length === 2) {
        comprovarCoincidencia();
    }
}

function comprovarCoincidencia() {
    const [carta1, carta2] = cartesSeleccionades;
    if (carta1.textContent === carta2.textContent) {
        punts += 10;
        puntsLabel.textContent = punts;
        parellesEncertades++;
        if (parellesEncertades == paraules.length) finalitzaJoc();
    } else {
        setTimeout(() => {
            carta1.disabled = false;
            carta2.disabled = false;
            carta1.style.backgroundColor = "blue";
            carta2.style.backgroundColor = "blue";
            carta1.style.color = "blue";
            carta2.style.color = "blue";
    
            punts -= 3;
            if (punts < 0) punts = 0;
            puntsLabel.textContent = punts;
        }, 1000);
    }
    cartesSeleccionades = [];
}

function finalitzaJoc() {
    
}

function cambiarColorDeFons() {
    if (navigator.userAgent.includes("Chrome")) {
        bodyBgColor = "#a4eda5";
        document.body.style.backgroundColor = bodyBgColor;
    } else {
        bodyBgColor = "orange";
        document.body.style.backgroundColor = bodyBgColor;
    }
    
    sessionStorage.setItem("color", bodyBgColor);
}

nom.textContent = nomStorage;

cambiarColorDeFons();
crearCartes();