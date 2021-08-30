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
// watches for the leave button to be clicked to go back to random cards screen
  $("#leaveVault").submit((event) => {
    event.preventDefault();
    window.location.href = "../index.html"
  })
}




// Fetches and combines data from the forms then sends that data to the display for searchQuery
function priceCheckerFetch(searchQuery, sortingStyle, currencyToFind){
  let cardSearchQueryUrl = `https://api.scryfall.com/cards/search?unique=prints&dir=${sortingStyle[1]}&order=${sortingStyle[0]}&q=${searchQuery}`
  let currencyFetchUrl = `https://api.coinbase.com/v2/prices/USD-${currencyToFind}/spot`
// use promise all to fetch 2 urls at once then get there values by using [0] [1]
  Promise.all([
    fetch(cardSearchQueryUrl),
    fetch(currencyFetchUrl)
    ])
       .then(function (responses) {
    return Promise.all(responses.map(function (response) {
      return response.json();
      throw new Error("Search Invalid")
    }));
  }).then(function (data) {
    let queryData = data[0];
    let exchangeData = data[1]
    displayQueryCards(queryData, exchangeData)
  })
  .catch(error => $(".results").text("No cards for the given search, Try keywords in the name such as: Sol, Primal, Black, Lotus.")
  );
}




// displays fetched card data from a specific query and update the card prices
function displayQueryCards(queryData, exchangeData) {
  // emptys the div and sets up variables
   let exchangeRate = parseFloat(exchangeData.data.amount)
   let currentCurrency = exchangeData.data.currency
  $(".results").empty();
  $(".results").append("<h2>Results</h2>")
  // ------------------------------------
  // loops through all the given cards for your search
  if (queryData.object === "error") {
    $(".results").text("No cards for the given search, Try keywords in the name such as: Sol, Primal, Black, Lotus.")
  } else {
    var i 
    for (i = 0; i < queryData.data.length; i++){
      let imgUrl = queryData.data[i].image_uris;
      let currentBasePrice = parseFloat(queryData.data[i].prices.usd)
      let currentBasePriceFoil = parseFloat(queryData.data[i].prices.usd_foil)
       currentBasePrice = currentBasePrice * exchangeRate;
       currentBasePriceFoil = currentBasePriceFoil * exchangeRate;

      // checks the price to make sure its a number
      if(isNaN(currentBasePrice)) {
        currentBasePrice = "Price not available, Try again later. Alternitavly The card may be too old.";
      } else {
        currentBasePrice = currentBasePrice.toFixed(2);
      };
      
      // checks the price to make sure its a number
      if(isNaN(currentBasePriceFoil)) {
        currentBasePriceFoil = "Price not available, Card may not have a foil version.";
      } else {
        currentBasePriceFoil = currentBasePriceFoil.toFixed(2);
      };

      // makes sure its not a double faced card if it is it gets the front face of that card
      if(queryData.data[i].image_uris === undefined) {
        imgUrl = queryData.data[i].card_faces[0].image_uris;
      };


// for later use
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
// -------------------------------


// displays updated card data from specific search
      $(".results").append(`
          <div class="mainPageCard">
            <div class="mainPageCardImg">
              <img src="${imgUrl.normal}">
            </div>
            <div class="mainPageCardInfo">
              <h3>Name:</h3><p> ${queryData.data[i].name}</p>
              <h3>Set:</h3><p> ${queryData.data[i].set_name}</p>
              <h3>Price(${currentCurrency}):</h3><p> ${currentBasePrice}</p>
              <h3>Foil price(${currentCurrency}):</h3><p> ${currentBasePriceFoil}</p>
              <h3>Abilitys:</h3><p> ${queryData.data[i].oracle_text}</p>
              <h3>EDHRec Rank:</h3><p> ${queryData.data[i].edhrec_rank}</p>
            </div>
          </div>`)
    }
  }
  $("div").removeClass("hidden")
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
  let randomCardImg = data.image_uris.normal;
  let randomAbilitys = data.oracle_text;
  let randomPriceToFind = data.prices.usd;
  let randomFoilPriceToFind = data.prices.usd_foil;
  let randomRank = data.edhrec_rank;
  let randomSet = data.set_name;
  // if the price is fluctuating too much or too high
  if(randomPriceToFind === null){
    randomPriceToFind = "Price Not Available. :(";
  };
  // if the price is fluctuating too much or too high
  if(randomFoilPriceToFind === null){
    randomFoilPriceToFind = "Price Not Available. :("
  };
  // if its a unranked item such as a basic land / tokens
  if(randomRank === undefined){
    randomRank = "N/A"
  };
// Display card info
  $(".random-card-area").append(`
          <div class="mainPageCard">
            <div class="mainPageCardImg">
              <img src="${randomCardImg}">
            </div>
            <div class="mainPageCardInfo">
              <h3>Name:</h3><p> ${randomCardName}</p>
              <h3>Set:</h3><p> ${randomSet}</p>
              <h3>Price(USD):</h3><p> $ ${randomPriceToFind}</p>
              <h3>Foil price(USD):</h3><p> $ ${randomFoilPriceToFind}</p>
              <h3>Abilitys:</h3><p> ${randomAbilitys}</p>
              <h3>EDHRec Rank:</h3><p> ${randomRank}</p>
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
// watches for a random card submit then calls the random fetch
  $("#mainRandomForm").submit((event) => {
    event.preventDefault();
    mainPageRandomFetch();
  });
}


// watches my pages on app load
$(watchAppStart);
$(watchPriceChecker);
