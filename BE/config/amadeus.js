const Amadeus = require("amadeus");

console.log("Creating Amadeus client...");
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

console.log("Amadeus client created:", !!amadeus.client);

module.exports = amadeus;