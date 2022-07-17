//Récupération des articles via l'API

fetch("http://localhost:3000/api/products")
    .then((response) => {
        if (response.ok) {
            response.json()
                .then((productsList) => {
                    for(let product of productsList) {
                        document.getElementById("items").innerHTML += `<a id="productLink" href="./product.html?id=${product._id}">
                                                                            <article>
                                                                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                                <h3 class="productName">${product.name}</h3>
                                                                                <p class="productDescription">${product.description}</p>
                                                                            </article>
                                                                        </a>`
                    };
                })
                .catch((error) => {
                    alert("Produits momentanément indisponible")
                });
        };
    })
    .catch((error) => {
        alert("Le serveur ne répond pas")
    });