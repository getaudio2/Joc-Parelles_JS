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

broadcastChannel.onmessage = (event) => {
    estatPartida.textContent = event.data;
};

function comencarPartida(){
    if(nomjugadorObj.value){
        win = window.open("joc.html", "joc");
        document.cookie = "nomJugador=" + nomjugadorObj.value;
    } else {
        alert("Has d'informar el nom d'un jugador");
    }
}

function borrarPartida(){
    estatPartida.textContent = "No hi ha cap partida en joc";
    localStorage.removeItem("partidaComencada");
    win.close();
}

function infoNavegador(){
    navegador = navigator.userAgent;
    infoNavegadorObj.textContent = navegador;

    if (navegador.includes("Chrome")) {
        document.body.style.backgroundColor = "#a4eda5";
    } else {
        document.body.style.backgroundColor = "orange";
    }
}

function infoURL(){
    infoUrlObj.textContent = location.origin;
}

infoNavegador()
infoURL()