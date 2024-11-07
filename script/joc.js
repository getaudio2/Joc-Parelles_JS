const nom = document.getElementById("nom");

//const nomStorage = localStorage.getItem("nom");
const nomStorage = document.cookie.split("=")[1];

nom.textContent = nomStorage;