$.ajax({
  url: "https://api.nosto.com/v1/graphql",
  type: "POST",
  contentType: "application/graphql",
  headers: {
    Authorization:
      "Basic " +
      btoa(
        //sadly no way to hide it without using a node js app
        ":" + "N7QnHtiseaaAtartB16sQ7jUcNAm0HgsTxTnwTX08GQ85EYShd90zN3qiYiDjVsq"
      ),
  },
  data: `query {
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
  }`,
  success: (response) => {
    let max = 0;

    let mostBoughtProduct = null;
    let carousel = $("#carousel");
    response.data.products.products.forEach((product) => {
      if (product.scores.week.views > max) {
        mostBoughtProduct = product;
        max = product.scores.week.views;
      }

      let item = $("<div  class='item'>");
      let formattedPrice = parseFloat(product.price); // Parse the price as a float

      item.html(
        '<img src="' +
          product.imageUrl +
          '" class="product-img" data-url="' +
          product.url +
          '" onerror="$(this).parent().remove()" data-alternateurl="' +
          product.alternateImageUrls +
          '">' +
          '<div class="product-name">' +
          product.name +
          "</div>" +
          '<div class="product-brand">' +
          product.brand +
          "</div>" +
          '<div class="product-price">€' +
          formattedPrice +
          "</div>"
      );

      if (product.name !== mostBoughtProduct.name) {
        carousel.append(item);
      }
    });

    let originalImageUrl;
    $(".product-img").hover(
      (event) => {
        originalImageUrl = $(event.target).attr("src");

        let alternateImageUrls = $(event.target).data("alternateurl");
        if (alternateImageUrls && alternateImageUrls.length > 0) {
          $(event.target).attr("src", alternateImageUrls);
        }
      },
      (event) => {
        if (originalImageUrl) {
          $(event.target).attr("src", originalImageUrl);
        }
      }
    );

    $("#bestseller-item").html(
      '<img class="product-img" src="' +
        mostBoughtProduct.imageUrl +
        '" data-url="' +
        mostBoughtProduct.url +
        "    >" +
        '<div class="bestseller-label"></div>'
    );

    $(".product-img ").click((event) => {
      let productURL = $(event.target).data("url");
      window.location.assign(productURL);
    });

    $(document).ready(() => {
      $("#carousel").slick({
        slidesToShow: 4,
        adaptiveHeight: false,

        dots: false,
        draggable: false,
        infinite: false,
        centerPadding: 0,
        draggable: false,
        variableWidth: true,
      });
    });
  },
});
