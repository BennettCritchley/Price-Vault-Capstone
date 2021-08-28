"use strict";
// Watches the price checker for a submit and takes the values of all the settings
function watchPriceChecker() {
  $(".searchForm").submit((event) => {
    event.preventDefault();
    const searchQuery = $(".cardSearchQuery").val();
    const currencyToFind = $("#currencys").val();
    const sortingStyle = $("#sortQuerys").val().split(",");
    priceCheckerFetch(searchQuery, sortingStyle, currencyToFind);
  });

  $('#leaveVault').submit((event) => {
    event.preventDefault();
    window.location.href = "../index.html"
  })

  // $('.close-button').submit((event) => {
  //   $(".cardSearchQuery").val() = '';
  // })
}




// Fetches and combines data from the forms then sends that data to the display for searchQuery
function priceCheckerFetch(searchQuery, sortingStyle, currencyToFind){
  let cardSearchQueryUrl = `https://api.scryfall.com/cards/search?unique=prints&dir=${sortingStyle[1]}&order=${sortingStyle[0]}&q=${searchQuery}`
  let currencyFetchUrl = `https://api.coinbase.com/v2/prices/USD-${currencyToFind}/spot`

  Promise.all([
    fetch(cardSearchQueryUrl),
    fetch(currencyFetchUrl)
    ])
       .then(function (responses) {
    return Promise.all(responses.map(function (response) {
      return response.json();
      throw new Error('Search Invalid')
    }));
  }).then(function (data) {
    let queryData = data[0];
    let exchangeData = data[1]
    displayQueryCards(queryData, exchangeData)
  })
  .catch(error => $(".results").text("No cards for the given search, Try keywords in the name such as: Sol, Primal, Black, Lotus.")
  );

  // fetch(cardSearchQueryUrl)
  //   .then(response => response.json())
  //   .then(queryData2 => exchangeRateFetch(currencyToFind))
  //   .then(queryData => displayQueryCards(queryData));
}




// displays fetched card data from a specific query and update the card prices
function displayQueryCards(queryData, exchangeData) {
   let exchangeRate = parseFloat(exchangeData.data.amount)
   let currentCurrency = exchangeData.data.currency
  $(".results").empty();
  $(".results").append(`<h2>Results</h2>`)
  if (queryData.object === "error") {
    $(".results").text("No cards for the given search, Try keywords in the name such as: Sol, Primal, Black, Lotus.")
  } else {
    var i 
    for (i = 0; i < queryData.data.length; i++){
      let imgUrl = queryData.data[i].image_uris;
      let currentBasePrice = parseFloat(queryData.data[i].prices.usd)
      // let currentBasePriceCheckBefore = parseFloat(queryData.data[i-1].prices.usd)
      let currentBasePriceFoil = parseFloat(queryData.data[i].prices.usd_foil)
       currentBasePrice = currentBasePrice * exchangeRate;
       currentBasePriceFoil = currentBasePriceFoil * exchangeRate;
      //  currentBasePriceCheckBefore = currentBasePriceCheckBefore * exchangeRate;

      if(isNaN(currentBasePrice)) {
        currentBasePrice = 'Price not available, Try again later. Alternitavly The card may be too old.';
      } else {
        currentBasePrice = currentBasePrice.toFixed(2);
      };
      
      if(isNaN(currentBasePriceFoil)) {
        currentBasePriceFoil = 'Price not available, Card may not have a foil version.';
      } else {
        currentBasePriceFoil = currentBasePriceFoil.toFixed(2);
      };

      if(queryData.data[i].image_uris === undefined) {
        imgUrl = queryData.data[i].card_faces[0].image_uris;
      };

      // if(queryData.data[i].oracle_text === undefined) {
      //   let abilityText = queryData.data[i].card_faces[0].oracle_text;
      // } else {
      //   let abilityText = queryData.data[i].oracle_text;
      // };

      // if(currentBasePriceFoil > currentBasePriceCheckBefore){
      //   queryData.data[i] = queryData.data[i-1]
      //   if (queryData.data[i] === queryData.data[-1]) {
      //     queryData.data[i] = queryData.data[0]
      //   }
      // } 

      $(".results").append(`
          <div class="mainPageCard">
            <div class="mainPageCardImg">
              <img src="${imgUrl.normal}">
            </div>
            <div class="mainPageCardInfo">
              <h4>Name:</h4><p> ${queryData.data[i].name}</p>
              <h4>Set:</h4><p> ${queryData.data[i].set_name}</p>
              <h4>Price(${currentCurrency}):</h4><p> ${currentBasePrice}</p>
              <h4>Foil price(${currentCurrency}):</h4><p> ${currentBasePriceFoil}</p>
              <h4>Abilitys:</h4><p> ${queryData.data[i].oracle_text}</p>
              <h4>EDHRec Rank:</h4><p> ${queryData.data[i].edhrec_rank}</p>
            </div>
          </div>`)
    }
  }
  $('div').removeClass("hidden")
};




// fetches the random card from the api then sends the data to mainPageDisplayRandom
function mainPageRandomFetch() {
  const randomCardUrl = "https://api.scryfall.com/cards/random?digital=false";

  fetch(randomCardUrl)
    .then(response => response.json())
    .then(data => mainPageDisplayRandom(data));
}




// Takes the fetch data (from random) and displays it aswell as removes the hidden class
function mainPageDisplayRandom(data) {
  $(".random-card-area").empty();
  let randomCardName = data.name;
  let randomCardImg = data.image_uris.small;
  let randomAbilitys = data.oracle_text;
  let randomPriceToFind = data.prices.usd;
  let randomFoilPriceToFind = data.prices.usd_foil;
  let randomRank = data.edhrec_rank;
  let randomSet = data.set_name;
  if(randomPriceToFind === null){
    randomPriceToFind = "Price Not Available. :(";
  };
  if(randomFoilPriceToFind === null){
    randomFoilPriceToFind = "Price Not Available. :("
  };
  if(randomRank === undefined){
    randomRank = "N/A"
  };

  $(".random-card-area").append(`
          <div class="mainPageCard">
            <div class="mainPageCardImg">
              <img src="${randomCardImg}">
            </div>
            <div class="mainPageCardInfo">
              <h4>Name: ${randomCardName}</h4>
              <h4>Set: ${randomSet}</h4>
              <h5>Price(USD): $ ${randomPriceToFind}</h5>
              <h5>Foil price(USD): $ ${randomFoilPriceToFind}</h5>
              <p>Abilitys: ${randomAbilitys}</p>
              <p>EDHRec Rank: ${randomRank}</p>
            </div>
          </div>`)
  $('div').removeClass('hidden')
}




// watches my app starting point for one of the buttons to be pressed to either A. take you into the price checker. or B. show you a random card
function watchAppStart() {
  $("#enterTheVault").submit((event) => {
    event.preventDefault();
    window.location.href = "Htmls/priceChecker.html";
    watchPriceChecker();

  });

  $("#mainRandomForm").submit((event) => {
    event.preventDefault();
    mainPageRandomFetch();
  });
}

$(watchAppStart);
$(watchPriceChecker);
