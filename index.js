"use strict";
// Watches the price checker for a submit and takes the values of all the settings
function watchPriceChecker() {
  console.log('Welcome to the Vault...');
}



// fetches the random card from the api then sends the data to mainPageDisplayRandom
function mainPageRandomFetch() {
  console.log('Loading Random Card...')
  mainPageDisplayRandom();
}



// Takes the fetch data (from random) and displays it aswell as removes the hidden class
function mainPageDisplayRandom() {
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