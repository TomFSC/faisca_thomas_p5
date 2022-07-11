

//Récupération du panier dans le localStorage
    let cart = JSON.parse(localStorage.getItem("cart"));


//Fonction pour calculer le total des articles au panier
function totalProductInCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let numberOfProducts = 0;
    for (let productInCart of cart) {
        numberOfProducts += productInCart.quantity;
    }
    return numberOfProducts;
};

//Fonction pour supprimer un produit dans le panier

function removeProduct (id, color) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart = cart.filter(article => article.id !== id && article.color !== color);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
    };


//Changement de la quantité produits dans le panier
function changeProductQuantity(id, color, newQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    foundSameProduct = cart.find(product => product.id == id && product.color == color);
    if (foundSameProduct != undefined) {
        foundSameProduct.quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
        if(newQuantity == 0) {
            removeProduct(id, color);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }
};

//Fonction pour le calcul du prix total du panier
let totalPrice = []; //On récupère les "totalProductPrice" de chaque produit du panier
function totalCartPrice() {    
    const calcTotal = (accumulator, currentValue) => accumulator + currentValue;
    const total = totalPrice.reduce(calcTotal);
    return total;
};

//On parcours le panier pour récupérer les produits à l'intérieur
for(let productChoice of cart) {
    //Récupération des autres données des articles du panier
    fetch("http://localhost:3000/api/products/" + productChoice.id)
    .then((response) => {
        response.json()
        .then((product) => {
            //Déclaration prix total par article
                    const totalProductPrice = parseInt(productChoice.quantity) * parseInt(product.price);
                    totalPrice.push(totalProductPrice);
                    //Affichage des articles dans le DOM
                    document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${productChoice.id}" data-color="${productChoice.color}">
                    <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${productChoice.color}</p>
                    <p>${totalProductPrice}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productChoice.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                    </div>
                    </div>
                    </article>`
                    //Ajout de la quantité totale d'articles du panier 
                    document.getElementById("totalQuantity").innerHTML = parseInt(totalProductInCart());
                    document.getElementById("totalPrice").innerHTML = totalCartPrice();
                    //On récupère l'élément <input> dans le domaine 
                    let input = document.getElementsByClassName('itemQuantity');
                    //On créé un tableau avec les éléments de <input> afin de le parcourir et en récupérer les données
                    Object.values(input).forEach(quantity => {
                        quantity.addEventListener('change', function () {
                            let article = quantity.closest("article");
                            let id = article.getAttribute("data-id");
                            let color = article.getAttribute("data-color");
                            let newQuantity = quantity.value;
                            if(newQuantity == 0) {
                                removeProduct(id, color)
                            }
                            else {
                                changeProductQuantity(id, color, newQuantity);
                            }
                        });
                    });
        });
    })
};