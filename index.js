"use strict";

// watches my app starting point for one of the buttons to be pressed to either A. take you into the price checker. or B. show you a random card
function watchApp() {
  console.log('App loaded...Pay homenage to the Vault')
  $("#enterTheVault").submit((event) => {
    event.preventDefault();
    location.href = "Htmls/priceChecker.html";
    return false;
  });
}

$(watchApp);