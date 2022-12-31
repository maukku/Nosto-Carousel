const getProducts = async () => {
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

  const data = await response.json();

  const products = data.data.products.products;

  let mostBoughtProduct = null;

  // Finding the one product with the highest number of views
  products.map((product) => {
    if (product.scores.week.views > 0) {
      mostBoughtProduct = product;
    }
  });

  const carousel = document.querySelector("#carousel");

  // Creating elements for each product
  products.forEach((product) => {
    // removing innecesary zeros
    const formattedPrice = parseFloat(product.price);
    const item = document.createElement("div");
    item.classList.add("item");

    // carousel items  being added
    item.innerHTML = `
      <img src="${product.imageUrl}" class="product-img" data-url="${product.url}" onerror="$(this).parent().remove()" data-alternateurl="${product.alternateImageUrls}">
      <div  class="product-brand">${product.brand}</div>
      <div class="product-name">${product.name}</div>
      
      <div class="product-price">€${formattedPrice}</div>
    `;

    // the most bought ones excluded from the rhe carousel, in a real case we would probably use an ID parameter
    if (product.name !== mostBoughtProduct.name) {
      carousel.appendChild(item);
    }
  });

  //  show alternate images when we hover , only on desktop

  $(document).ready(() => {
    let desktopWidth = $(window).width();

    if (desktopWidth >= 1025) {
      console.log(desktopWidth);
      document.querySelectorAll(".product-img").forEach((img) => {
        let originalImageUrl;
        img.addEventListener("mouseenter", () => {
          originalImageUrl = img.getAttribute("src");
          const alternateImageUrls = img.getAttribute("data-alternateurl");
          if (alternateImageUrls && alternateImageUrls.length > 0) {
            img.setAttribute("src", alternateImageUrls);
          }
        });
        img.addEventListener("mouseleave", () => {
          if (originalImageUrl) {
            img.setAttribute("src", originalImageUrl);
          }
        });
      });
    }
  });

  // Most bought product element html
  document.querySelector("#bestsellerItem-container").innerHTML = `
    <img class="product-img" src="${mostBoughtProduct.imageUrl}" 
    data-url="${mostBoughtProduct.url}">
    <div class="bestseller-label">Best seller this week!</div>
  `;

  //Product URL navigation
  document.querySelectorAll(".product-img").forEach((img) => {
    img.addEventListener("click", () => {
      const productURL = img.getAttribute("data-url");
      window.location.assign(productURL);
    });
  });

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

getProducts();
