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

//Evénement au click sur le bouton pour ajout produit au panier

addButton.addEventListener('click', (event) => {
    event.preventDefault();
    //Si la quantité est à 0
    if (quantity.value == 0){
        alert("Veuillez renseigner une quantité")
    }
    //Si aucune couleur n'est sélectionnée
    else if (color.value === "") {
        alert("Veuillez sélectionner une couleur")
    }
    //Si la quantité est supérieure à 100
    else if (quantity.value > 100) {
        alert("Vous ne pouvez pas commander plus de 100 produits")
    }
    //Si choix produit OK on récupère les informations id, color et quantity du produit
    else {
        const productChoice = {
            id: productId,
            color: color.value,
            quantity: quantity.value
        };
        console.log(productChoice);
        addToCart(productChoice); //Appel de la fonction pour l'ajout du produit au panier

        //-------------------------------Enregistrement produit dans le localStorage-------------------------------

        //Fonction pour la récupération du panier dans le localStorage
        function getCart() {
            let cart = localStorage.getItem("cart");
            if (cart == null) {
                return [];
            }
            else {
                return JSON.parse(cart);
            }
        }

            //Fonction ajout article supplémentaire au panier en vérifiant si le même produit avec le même colori existe déjà
    
        function addToCart(productChoice) {
            let cart = getCart();
            let foundSameProduct = cart.find(productChoiceId => productChoiceId.id == productChoice.id) && cart.find(productChoiceColor => productChoiceColor.color == productChoice.color);
            if(foundSameProduct != undefined) {
                foundSameProduct.quantity = parseInt(foundSameProduct.quantity) + parseInt(productChoice.quantity);
            }
            else {
                productChoice.quantity = quantity.value; 
                cart.push(productChoice);
            }
            saveCart(cart);
            alert("Produit ajouté au panier");
        }

            //Fonction sauvegarde du panier dans le localStorage

        function saveCart(cart) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } 
    }
});