"use strict";
// Watches the price checker for a submit and takes the values of all the settings
function watchPriceChecker() {
  console.log('Welcome to the Vault...');
}



// fetches the random card from the api then sends the data to mainPageDisplayRandom
function mainPageRandomFetch() {
  const randomCardUrl = "https://api.scryfall.com/cards/random?digital=false";
  console.log('Loading Random Card...');

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
  if(randomPriceToFind === null){
    randomPriceToFind = "Price Not Available. :("
  };
  $(".random-card-area").append(`
          <div class="mainPageCard">
            <div class="mainPageCardImg">
              <img src="${randomCardImg}">
            </div>
            <div class="mainPageCardInfo">
              <h4>Name: ${randomCardName}</h4>
              <h5>Price: ${randomPriceToFind}</h5>
              <h5>Foil price: ${randomFoilPriceToFind}</h5>
              <p>Abilitys: ${randomAbilitys}</p>
              <p>EDHRec Rank: ${randomRank}</p>
            </div>
          </div>`)
  $('div').removeClass('hidden')
}



// watches my app starting point for one of the buttons to be pressed to either A. take you into the price checker. or B. show you a random card
function watchAppStart() {
  console.log('App loaded...Pay homenage to the Vault');
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