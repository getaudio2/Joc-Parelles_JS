// DECLARAR OBJECTES

const btnPartida = document.getElementById("btn-partida");
const btnBorrar = document.getElementById("btn-borrar");
const nomjugadorObj = document.getElementById("nom-jugador");
const infoNavegadorObj = document.getElementById("info-navegador");
const infoUrlObj = document.getElementById("info-url");
const estatPartida = document.getElementById("estat-partida");

// DECLARAR EVENTS

btnPartida.addEventListener("click", comencarPartida);
btnBorrar.addEventListener("click", borrarPartida);

// DECLARAR VARIABLES Y CONSTANTS

const broadcastChannel = new BroadcastChannel("joc_parelles");
let win;

// FUNCIONALITAT

// Conexió al broadcastchannel per actualitzar la puntuació y l'estat del joc en temps real
broadcastChannel.onmessage = (event) => {
    estatPartida.textContent = event.data;
};

// Si s'ha introduït un nom de jugador, es guarda a una cookie y s'obre joc.html en una nova pestanya
function comencarPartida(){
    if(nomjugadorObj.value){
        win = window.open("joc.html", "joc");
        document.cookie = "nomJugador=" + nomjugadorObj.value;
    } else {
        alert("Has d'informar el nom d'un jugador");
    }
}

// Funció per eliminar la memòria emmagatzemada de l'estat del joc
function borrarPartida(){
    estatPartida.textContent = "No hi ha cap partida en joc";
    localStorage.removeItem("partidaComencada");
    win.close();
}

// Amb navigator.userAgent agafem la informació del navegador
function infoNavegador(){
    navegador = navigator.userAgent;
    infoNavegadorObj.textContent = navegador;

    if (navegador.includes("Chrome")) {
        document.body.style.backgroundColor = "#a4eda5"; // Si es tracta de Chrome, el color de fons canvia a verd
    } else {
        document.body.style.backgroundColor = "orange"; // Sino canvia a taronja
    }
}

function infoURL(){
    infoUrlObj.textContent = location.origin; // Agafem el protocol, hostname i número del port de l'URL
}

infoNavegador()
infoURL()