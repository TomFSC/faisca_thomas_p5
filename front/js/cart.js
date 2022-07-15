

//Récupération du panier dans le localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
};

//Fonction de sauvegarde du panier dans le localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
};


//Fonction pour calculer le total des articles au panier
function totalProductInCart() {
    getCart();
    let numberOfProducts = 0;
    for (let productInCart of cart) {
        numberOfProducts += parseInt(productInCart.quantity);
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
        saveCart(cart);
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

//---------VALIDATION ET ENVOI DU FORMULAIRE----------
//Déclaration des variables et éléments du DOM pour formulaire contact clients

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
let newOrder = document.getElementById("order");

//Vérification des données du formulaire

//RegExp pour prénom
let firstNameRegExp = /^[a-zA-Z-\s?]{1,50}/g;

//RegExp pour le nom
let lastNameRegExp = /^[a-zA-Z-\s?]{1,50}/g;

//RegExp pour la ville
let cityRegExp = /^[a-zA-Z-\s?]{1,50}/g;

//Validation de l'e-mail
email.addEventListener('change', function() {
    //RegExp pour email
    let emailRegExp = /^[a-zA-Z][\w]{1,25}[@]{1}[\w]{1,25}[.]{1}[a-z]{1,10}$/g;
    //Test de la RegExp
    let testEmail = emailRegExp.test(email.value);
    let errorMessage = document.getElementById("emailErrorMsg");
    if(testEmail == false) {
        email.style.color = "red";
        errorMessage.innerHTML = "Adresse E-mail non valide" ;
    }
    else {
        email.style.color = "green";
        errorMessage.innerHTML = "";
    }
});

//Validation du prénom
firstName.addEventListener('change', function() {
    let testFirstName = firstNameRegExp.test(firstName.value);
    let errorMessage = document.getElementById("firstNameErrorMsg");
    if(testFirstName === false) {
        firstName.style.color = "red";
        errorMessage.innerHTML = "Le prénom ne doit pas contenir de chiffre ou de caractères spéciaux";
    }
    else {
        firstName.style.color = "green";
        errorMessage.innerHTML = "";
    }
    console.log(testFirstName);
});

//Validation du nom
lastName.addEventListener('change', function() {
    let testLastName = lastNameRegExp.test(lastName.value);
    let errorMessage = document.getElementById("lastNameErrorMsg");
    if(testLastName === false) {
        lastName.style.color = "red";
        errorMessage.innerHTML = "Le nom ne doit pas contenir de chiffre ou de caractères spéciaux";
    }
    else {
        lastName.style.color = "green";
        errorMessage.innerHTML = "";
    }
});

//Input adresse
address.addEventListener('change', function() {
        address.style.color = "green";
});

//Validation de la ville
city.addEventListener('change', function() {
    let testCity = cityRegExp.test(city.value);
    let errorMessage = document.getElementById("cityErrorMsg");
    if(testCity === false) {
        city.style.color = "red";
        errorMessage.innerHTML = "La ville en doit pas contenir de chiffre ou de caractères spéciaux";
    }
    else {
        city.style.color = "green";
        errorMessage.innerHTML = "";
    }
})


//Fonction pour la création de l'objet contact/produits
function createOrderContact() {   
    //On créé un tableau pour récupérer les "id" des produits du panier
    let products = [];
    //On créé un tableau contact pour récupérer les données clients
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };
    console.log(contact);
    //On parcourt le panier pour trouver les "id"
    for(let productsList of cart) {
        let item = cart.find(p => p.id == productsList.id);
        if(item != undefined) {
            //On envoie les id produits dans le tableau "products"
            products.push(productsList.id);
        }
        else {
            alert("Votre panier est vide");
        }
    };
    console.log(products);
    //On créé notre objet au format JSON (contenant les 2 tableaux contact et products liés) pour envoi à l'API
    let orderData = JSON.stringify({contact, products});
    console.log(orderData);
};





