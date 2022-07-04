//Récupération de l'id produit page en cours

let urlPage = window.location.href;

let url = new URL(urlPage);
let productId = url.searchParams.get ("id");

//Récupération du produit correspondant à l'id de la page en cours

fetch("http://localhost:3000/api/products/" + productId)
    .then((response) => {
        if(response.ok) {
            response.json()
                .then((product) => { //Insertion des éléments du produit correspondant à l'id
                    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
                    document.getElementById("title").innerHTML = `${product.name}`
                    document.getElementById("price").innerHTML = `${product.price}`
                    document.getElementById("description").innerHTML = `${product.description}`
                    const colorsList = product.colors;
                    for(let color of colorsList) {
                        document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`
                    }
            })
            .catch((error) => {
                alert("Produit indisponible")
            })
    }})
    .catch((error) => {
        alert("Le serveur ne répond pas")
    })

//Eléments du DOM

let addButton = document.getElementById("addToCart");
let color = document.getElementById("colors");
let quantity = document.getElementById("quantity");

//Evénement au click sur le bouton

addButton.addEventListener('click', e => {
    if (color.value != "" && quantity.value != 0 && quantity.value < 100) {
        let productChoice = {
            id: productId,
            color: color.value,
            quantity: quantity.value,
        }
        const addToCart = (productChoice);
        console.log(productChoice);
    }
    //Si aucune couleur n'est sélectionnée
    else if (color.value === "") {
        alert("Veuillez sélectionner une couleur")
    }
    //Si la quantité est supérieure à 100
    else if (quantity.value > 100) {
        alert("Vous ne pouvez pas commander plus de 100 produits")
    }
})