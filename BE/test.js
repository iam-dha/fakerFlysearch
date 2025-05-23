const axios = require("axios");

const getFlightOffers = async () => {
  const token = await getAccessToken();

  const response = await axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      originLocationCode: "SGN",
      destinationLocationCode: "HAN",
      departureDate: "2024-06-15",
      adults: 1,
      currencyCode: "VND"
    }
  });

  console.log(JSON.stringify(response.data.data[0], null, 2)); // <-- Đây chính là flightOffer mẫu
};