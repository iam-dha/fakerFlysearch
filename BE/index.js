const express = require("express");
const cors = require("cors");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const systemConfig = require("./config/system.js");
require("dotenv").config();
const cron = require("node-cron");
const releaseExpiredBookings = require("./helpers/bookingTimeout.helper");
const amadeus = require("./config/amadeus");

//Add route
const clientRoute = require("./routes/client/index.routes");
const adminRoute = require("./routes/admin/index.routes");

//Flight route
// const adminBookingRoutes = require("./routes/admin/booking.routes");


//Database Connect
const database = require("./config/database.js")
database.connect();

const app = express();
const port = process.env.PORT;

//Set view and public folder
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug'); // which template engine
app.use(express.static(`${__dirname}/public`));

//App local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Turn cors for all origin
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',  // URL Frontend
  credentials: true  // Send cookies for refresh token
}));

//Body parser config parse x-www-form-urlencoded
app.use(bodyParser.urlencoded());
//Parse application/json
app.use(express.json());


//Config Cookie-parse
app.use(cookieParser(process.env.COOKIE_SECRET));

//Method override
app.use(methodOverride("_method"));



clientRoute(app);
adminRoute(app);

// app.use(`${systemConfig.apiPath}/v1/admin/bookings`, adminBookingRoutes);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })

// Chạy mỗi 10 phút
  cron.schedule("*/60 * * * *", () => {
  releaseExpiredBookings();
});