//Récupération de orderId dans l'url de la page en cours

let confirmationUrl = window.location.href;
let url = new URL(confirmationUrl);
let orderId = url.searchParams.get("id");

//Ajout du numéro de commande dans le DOM

document.getElementById("orderId").innerHTML = `${orderId}`;