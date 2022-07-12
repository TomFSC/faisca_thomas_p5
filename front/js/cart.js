

//Récupération du panier dans le localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
};

//Fonction de sauvegarde du panier dans le localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
};


//Fonction pour calculer le total des articles au panier
function totalProductInCart() {
    getCart();
    let numberOfProducts = 0;
    for (let productInCart of cart) {
        numberOfProducts += productInCart.quantity;
    }
    return numberOfProducts;
};

//Fonction pour supprimer un produit dans le panier
function removeProduct (id, color) {
    getCart();
    //On créé un object avec l'id et la couleur du produit à supprimer (clic du bouton ou quantité à 0)
    const delectedProduct = {
        productId: id,
        productColor: color
    };
    //On créé un nouveau panier qui ne contiendra que les élément du localStorage ayant un id et une couleur différente
    const newCart = cart.filter((item) => {
        for (let key in delectedProduct) {
            if (item.id == delectedProduct[key] && item.color == delectedProduct.productColor)
            return false;
        }
        return true;
    });
    //On sauvegarde notre nouveau panier en gardant la même clé que l'ancien
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert("Votre produit à été retiré du panier");
    window.location.href ="cart.html";
};
        
            
        


//Changement de la quantité produits dans le panier
function changeProductQuantity(id, color, newQuantity) {
    getCart();
    foundSameProduct = cart.find(product => product.id == id && product.color == color);
    if (foundSameProduct != undefined) {
        foundSameProduct.quantity = newQuantity;
        saveCart();
        alert("La quantité a bien été modifiée");
        window.location.href ="cart.html";
        if (newQuantity == 0) {
            removeProduct(id, color);
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
let cart = getCart();
for (let productChoice of cart) {
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
                    //On créé un tableau avec les éléments de <article> et la value de <input> afin de le parcourir et en récupérer les données
                    Object.values(input).forEach(quantity => {
                        quantity.addEventListener('change', function() {
                            let article = quantity.closest("article");
                            let id = article.getAttribute("data-id");
                            let color = article.getAttribute("data-color");
                            let newQuantity = quantity.value;
                            if (newQuantity < 0 || newQuantity > 100) {
                                alert("La quantitée doit être comprise entre 1 et 100");
                                window.location.href ="cart.html";
                            }
                            else {
                                changeProductQuantity(id, color, newQuantity);
                            }
                        });
                    });
                    //On récupère l'élément <p>supprimer</p> dans le DOM 
                    let deleteButton = document.getElementsByClassName("deleteItem");
                    //On créé un tableau avec les éléments de <article> afin de le parcourir et en récupérer les données
                    Object.values(deleteButton).forEach(deleteProduct => {
                        deleteProduct.addEventListener('click', function() {
                            let article = deleteProduct.closest("article");
                            let id = article.getAttribute("data-id");
                            let color = article.getAttribute("data-color");
                            removeProduct(id, color);
                        })
                    });
                        
        });
    })
};