//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- create an express application --- 
const express = require("express");
const app = express();

// *** --- support HTTP version of app  ---
const http = require("http");
const createError = require("http-errors");

// *** --- support mongoose for database connect ---
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb')

// *** --- error handling for development only mode ---
const errorhandler = require("errorhandler");

// *** --- enable CORS for user request ---
const cors = require("cors");

// *** --- implement middleware ---
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require('passport');

// *** --- include database models ---
require("dotenv/config");
require("./models/UserSchema");
require("./models/CharacterSchema");
require("./models/WalletSchema");
require("./models/NFTSchema");
require("./models/ItemSchema");
require('./config/passport');

// *** --- implement cors ---
app.use(cors());

// *** --- middleware configuration ---
app.use(require("morgan")("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());
app.use(require("method-override")());
app.use(
    // set session for API request
    session({
        secret: process.env.SECRET,
        cookie: {
            maxAge: 60000,
        },
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// *** --- import API routes ---
app.use(require("./routes"));

// *** --- connect to the database and track errors if in dev mode ---
mongoose.connect(
    process.env.DB_CLOUD_CONNECTION,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    () => console.log("connected to the databse!")
);

if (process.env.DB_CONNECTION === "dev") {
    // add debug tracking for dev environment
    mongoose.set("debug", true);
    mongoose.set("setCreateIndex", true);

    // development error handler
    app.use(errorhandler());
}

// *** --- catch 404 and forward to the errorhandler ---
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.json({
        message: err.message,
        error: err
    });
})

console.log(`port is ${process.env.PORT}`, )
console.log(`API base is ${process.env.REACT_APP_API_URL}`)
console.log(`DB connection is ${process.env.DB_CLOUD_CONNECTION}`)

//*** --- binds and listens for connections on the specific host and port ---
http.createServer(app).listen(process.env.PORT);
