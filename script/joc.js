// DECLARAR OBJECTES

const nom = document.getElementById("nom");
const btnInstruccions = document.getElementById("btn-instruccions");
//const nomStorage = localStorage.getItem("nom");
const nomStorage = document.cookie.split("=")[1];

// DECLARAR EVENTS
// btnInstruccions.addEventListener("click",);

// DECLARAR VARIABLES Y CONSTANTS

// FUNCIONALITAT

if (navigator.userAgent.includes("Chrome")) {
    document.body.style.backgroundColor = "#a4eda5";
} else {
    document.body.style.backgroundColor = "orange";
}

sessionStorage.setItem("color", );

nom.textContent = nomStorage;