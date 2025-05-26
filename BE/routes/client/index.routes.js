const systemConfig = require("../../config/system");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const flightRoute = require("./flight.routes");
const hotelRoute = require("./hotel.routes");
const carRoute = require("./car.routes");
const bookingRoute = require("./booking.routes");
const promotionRoute = require("./promotion.routes");
module.exports = (app) => {
  app.use(`${systemConfig.apiPath}/v1/client/auth`, authRoute);
  app.use(`${systemConfig.apiPath}/v1/client/user`, userRoute);
  app.use(`${systemConfig.apiPath}/v1/client/flights`, flightRoute);
  app.use(`${systemConfig.apiPath}/v1/client/hotels`, hotelRoute);
  app.use(`${systemConfig.apiPath}/v1/client/cars`, carRoute);
  app.use(`${systemConfig.apiPath}/v1/client/bookings`, bookingRoute);
  app.use(`${systemConfig.apiPath}/v1/client/promotions`, promotionRoute);
};

