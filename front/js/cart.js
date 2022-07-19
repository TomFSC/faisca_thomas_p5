//---------------Déclaration des différentes fonctions utilisées-------------

//Récupération du panier dans le localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
};
let cart = getCart();

//Fonction de sauvegarde du panier dans le localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
};

//Fonction pour calculer le total des articles au panier
function totalProductInCart() {
    getCart();
    let numberOfProducts = 0;
    for(let productInCart of cart) {
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
    const newCart = cart.filter((item) => !(
        item.id == delectedProduct.productId && item.color == delectedProduct.productColor
        )
    );
    //On sauvegarde notre nouveau panier en gardant la même clé que l'ancien
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert("Votre produit à été retiré du panier");
    window.location.href ="cart.html";
};

//Fonction pour le changement de quantité produits dans le panier
function changeProductQuantity(id, color, newQuantity) {
    getCart(cart);
    if(newQuantity < 0 || newQuantity > 100) {
        alert("La quantitée doit être comprise entre 1 et 100");
        location.reload();
    }
    else if(newQuantity == 0) {
        removeProduct(id, color);
    }
    else {
        foundSameProduct = cart.find(product => product.id == id && product.color == color);
        if(foundSameProduct != undefined) {
            foundSameProduct.quantity = newQuantity;
            alert("La quantité a bien été modifiée");
            window.location.href = "cart.html";
        }
        saveCart(cart);
    }
};

//On récupère les "totalProductPrice" de chaque produit du panier
let totalPrice = [];
//Fonction pour le calcul du prix total du panier
function totalCartPrice() {    
    const calcTotal = (accumulator, currentValue) => accumulator + currentValue;
    let total = totalPrice.reduce(calcTotal);
    return total;
};

//Fonction pour l'affichage du panier uniquement si le panier n'est pas vide
function cartDisplay() {   
    if(cart != null) { 
        //On parcours le panier pour récupérer les produits à l'intérieur
        for (let productChoice of cart) {
            //Récupération des autres données des articles du panier
            fetch("http://localhost:3000/api/products/" + productChoice.id)
            .then((response) => {
                response.json()
                .then((product) => {
                    //Affichage des articles dans le DOM
                    document.getElementById("cart__items").innerHTML += 
                    `<article class="cart__item" data-id="${productChoice.id}" data-color="${productChoice.color}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${productChoice.color}</p>
                                <p>${product.price}€</p>
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
                    //Calcul du prix total du panier
                        //On calcule le prix total par article que l'on envoie dans le tableau totalPrice
                    let totalProductPrice = parseInt(productChoice.quantity) * parseInt(product.price);
                    totalPrice.push(totalProductPrice);
                        //Ajout du prix total du panier
                    document.getElementById("totalPrice").innerHTML = totalCartPrice();
                    //Modification de la quantitée
                        //On récupère l'élément <input> dans le domaine 
                    let input = document.getElementsByClassName('itemQuantity');
                        //On créé un tableau avec les attributs de <article> et la value de <input> afin de le parcourir et en récupérer les données
                    Object.values(input).forEach(quantity => {
                        quantity.addEventListener('change', function() {
                            let article = quantity.closest("article");
                            let id = article.getAttribute("data-id");
                            let color = article.getAttribute("data-color");
                            let newQuantity = quantity.value;
                            changeProductQuantity(id, color, newQuantity);
                        });
                    });
                    //Suppression d'un produit
                        //On récupère l'élément <p>supprimer</p> dans le DOM 
                    let deleteButton = document.getElementsByClassName("deleteItem");
                        //On créé un tableau avec les attributs de <article> afin de le parcourir et en récupérer les données
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
    };
};

//On appelle la fonction d'affichage du panier
cartDisplay();

//---------VALIDATION ET ENVOI DU FORMULAIRE----------

//Déclaration des variables et éléments du DOM pour formulaire contact clients
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
let newOrder = document.getElementById("order");

//Vérification des données du formulaire

//Validation de l'e-mail
email.addEventListener('input', function() {
    //RegExp pour email
    let emailRegExp = /^[a-zA-Z][\w]{1,25}@[\w]{1,25}\.[a-z]{2,10}$/;
    //Test de la RegExp
    let testEmail = emailRegExp.test(email.value);
    let errorMessage = document.getElementById("emailErrorMsg");
    if(testEmail == false) {
        email.style.color = "red";
        errorMessage.innerHTML = "Adresse E-mail non valide" ;
    }
    else if(testEmail == true){
        email.style.color = "green";
        errorMessage.innerHTML = "";
    }
});

//Fonction pour la validation des infos prénom, nom et ville du formulaire
function dataValidation(input) {
    //Déclaration de la RegExp
    let dataRegExp = /^[a-zA-Z]{1,50}$/;
    //Test de la RegExp
    let testData = dataRegExp.test(input.value);
    let errorMessage = input.nextElementSibling;
    if(testData === false) {
        input.style.color = "red";
        errorMessage.innerHTML = "Caractère non autorisé";
    }
    else if(testData === true) {
        input.style.color = "green";
        errorMessage.innerHTML = "";
    }
};

//Validation du prénom
firstName.addEventListener('change', function() {
    dataValidation(this);
});

//Validation du nom
lastName.addEventListener('change', function() {
    dataValidation(this);
});

//Input adresse(non testée car multitude de format d'adresse en fonction du pays)
address.addEventListener('change', function() {
    address.style.color = "green";
});

//Validation de la ville
city.addEventListener('change', function() {
    dataValidation(this);
});

//Fonction pour la création de l'objet contact/produits
function createOrderData() {   
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
    //La fonction retourne un objet orderData(contenant les 2 tableaux contact et products liés) pour envoi à l'API
    return orderData = ({contact, products});
};
//Au click sur le boutton commander on appelle la fonction createOrderData et on envoie notre objet dataOrder a l'API
newOrder.addEventListener('click', (e) => {
    e.preventDefault();
    if(firstName.value == "" || lastName.value == "" || address.value == "" || city.value == "" || email.value == "") {
        alert("Formulaire incomplet: Veuilez renseigner tous les éléments")
    }
    else {       
        createOrderData();
        
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(orderData), //Envoi de l'objet orderData au format JSON
        })
        .then((response) => response.json())
        .catch((error) => {
            alert("Un problème est survenu")
        })
        .then((data) => {
            //On efface les données du localStorage
            localStorage.clear();
            //On renvoie vers la page de confirmation en lui ajoutant le numéro de commande renvoyé par l'API
            window.location.href = "./confirmation.html?id=" + data.orderId;
        })
    }
});




