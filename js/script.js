// First we define an async function to handle the AJAX request
const getProducts = async () => {
  // Define the GraphQL query as a template literal
  const query = `
    query {
      products (limit: 50) {
        products {
          name
          price
          listPrice
          brand
          imageUrl
          alternateImageUrls
          url
          scores {
            week {
              views
              buys
            }
          }
        }
      }
    }
  `;

  // Make the AJAX request using fetch and providing the necessary options
  const response = await fetch("https://api.nosto.com/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/graphql",
      Authorization: `Basic ${btoa(
        ":" + "N7QnHtiseaaAtartB16sQ7jUcNAm0HgsTxTnwTX08GQ85EYShd90zN3qiYiDjVsq"
      )}`,
    },
    body: query,
  });

  // Convert the response to JSON
  const data = await response.json();

  // Extract the products from the response data
  const products = data.data.products.products;

  let mostBoughtProduct = null;

  // Loop through the products and find the one with the highest number of views
  products.forEach((product) => {
    if (product.scores.week.views > 0) {
      mostBoughtProduct = product;
    }
  });

  // Select the carousel element
  const carousel = document.querySelector("#carousel");

  // Loop through the products again, creating elements for each product
  products.forEach((product) => {
    // Parse the product price as a float
    const formattedPrice = parseFloat(product.price);

    // Create a new div element for the product
    const item = document.createElement("div");
    item.classList.add("item");

    // Set the inner HTML for the product element
    item.innerHTML = `
      <img src="${product.imageUrl}" class="product-img" data-url="${product.url}" onerror="$(this).parent().remove()" data-alternateurl="${product.alternateImageUrls}">
      <div class="product-name">${product.name}</div>
      <div class="product-brand">${product.brand}</div>
      <div class="product-price">€${formattedPrice}</div>
    `;

    // Only append the product element to the carousel if it is not the most bought
    if (product.name !== mostBoughtProduct.name) {
      carousel.appendChild(item);
    }
  });

  // Add a hover event listener to the product images to switch between the main and alternate images
  document.querySelectorAll(".product-img").forEach((img) => {
    let originalImageUrl;
    img.addEventListener("mouseenter", (event) => {
      originalImageUrl = img.getAttribute("src");
      const alternateImageUrls = img.getAttribute("data-alternateurl");
      if (alternateImageUrls && alternateImageUrls.length > 0) {
        img.setAttribute("src", alternateImageUrls);
      }
    });
    img.addEventListener("mouseleave", (event) => {
      if (originalImageUrl) {
        img.setAttribute("src", originalImageUrl);
      }
    });
  });

  // Set the inner HTML for the most bought product element
  document.querySelector("#bestseller-item").innerHTML = `
    <img class="product-img" src="${mostBoughtProduct.imageUrl}" data-url="${mostBoughtProduct.url}">
    <div class="bestseller-label">Best seller this week!</div>
  `;

  // Add a click event listener to the product images to navigate to the product URL
  document.querySelectorAll(".product-img").forEach((img) => {
    img.addEventListener("click", (event) => {
      const productURL = img.getAttribute("data-url");
      window.location.assign(productURL);
    });
  });

  // Initialize the carousel using the Slick library
  $(document).ready(() => {
    $("#carousel").slick({
      slidesToShow: 4,
      adaptiveHeight: true,
      dots: false,
      draggable: false,
      infinite: false,
      centerPadding: 0,
      draggable: false,
      variableWidth: true,
    });
  });
};

// Call the getProducts function to make the initial AJAX request
getProducts();
