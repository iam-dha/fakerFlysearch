const systemConfig = require("../../config/system");
const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const postRoute = require("./post.routes");
const roleRoute = require("./role.routes");
const promotionRoute = require("./promotion.routes");
const flightRoute = require("./flight.routes");
const hotelRoute = require("./hotel.routes");
const busRoute = require("./busRoute.routes");
const busCompanyRoute = require("./busCompany.routes");

const bookingRoute = require("./booking.routes");
module.exports = (app) => {
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/auth`, authRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/users`, userRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/posts`, postRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/promotions`, promotionRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/flights`, flightRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/hotels`, hotelRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/bookings`, bookingRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/roles`, roleRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/bus-companies`, busCompanyRoute);
    app.use(`${systemConfig.apiPath}/v1/${systemConfig.prefixAdmin}/bus-routes`, busRoute);
    
}