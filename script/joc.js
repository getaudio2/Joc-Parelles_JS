const nom = document.getElementById("nom");

const nomStorage = localStorage.getItem("nom");

nom.textContent = nomStorage;