const systemConfig = require("../../config/system");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
module.exports = (app) => {
    app.use(`${systemConfig.apiPath}/v1/auth`, authRoute);
    app.use(`${systemConfig.apiPath}/v1/user`, userRoute);
}