// DECLARAR OBJECTES

const btnPartida = document.getElementById("btn-partida");
const btnBorrar = document.getElementById("btn-borrar");
const nomjugadorObj = document.getElementById("nom-jugador");
const infoNavegadorObj = document.getElementById("info-navegador");
const infoUrlObj = document.getElementById("info-url");

// DECLARAR EVENTS

btnPartida.addEventListener("click", comencarPartida);
btnBorrar.addEventListener("click", borrarPartida);

// DECLARAR VARIABLES Y CONSTANTS

let win;

// FUNCIONALITAT

function comencarPartida(){
    if(nomjugadorObj.value){
        win = window.open("joc.html", "joc", "width=400,height=400");
        localStorage.setItem("nom", nomjugadorObj.value);
    } else {
        alert("Has d'informar el nom d'un jugador");
    }
}

function borrarPartida(){
    win.close();
}

function infoNavegador(){
    infoNavegadorObj.textContent = navigator.userAgent;
}

function infoURL(){
    infoUrlObj.textContent = location.origin;
}

infoNavegador()
infoURL()