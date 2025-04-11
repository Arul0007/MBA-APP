const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
// const { JWTStrategy } = require("@sap/xssec");
const xsenv = require("@sap/xsenv");
xsenv.loadEnv();
const hdbext = require("@sap/hdbext");
// const passport = require("passport");
const applicationFormRoutes = require("./routes/applicationForm.routes")


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));


console.log("Environment::", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  // app.use(logging.middleware({ appContext: appContext, logNetwork: true }));
  // For JWT XSUAA in BTP
  // passport.use(
  //   new JWTStrategy(xsenv.getServices({ uaa: { tag: "xsuaa" } }).uaa)
  // );
  // app.use(passport.initialize());
  // app.use(passport.authenticate("JWT", { session: false }));
  // console.log("SAP JWT Token Verified");
 
  //For Hana DB hosting in BTP
  const hanaConfig = xsenv.cfServiceCredentials({
    tag: "hana",
    plan: "hdi-shared",
  });
  app.use(hdbext.middleware(hanaConfig));
} else if (process.env.NODE_ENV === "development") {
  // Hana For Local Development
  const hanaConfig = {
    serverNode: process.env.HDI_HOST + ":" + process.env.HDI_PORT,
    uid: process.env.HDI_USER,
    pwd: process.env.HDI_PWD,
    CURRENTSCHEMA: process.env.HDI_SCHEMA,
    encrypt: true,
    sslValidateCertificate: false,
    pooling: true,
    maxPoolSize: 0,
    connectionLifetime: 0,
    prefetch: true,
  };
  app.use(hdbext.middleware(hanaConfig));
 
 
}
 

app.use('/api',()=>{
console.log("Server Reached MBA Application Form Server")
})

app.use('/api/applicationForm',applicationFormRoutes)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
