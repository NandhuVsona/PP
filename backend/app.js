const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/userRoutes.js");
const morgan = require("morgan");
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const googleStrategy = require("passport-google-oauth2");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const { product, tempUser } = require("./controllers/authController.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// 1) GLOBAL MIDDLEWARES

// Set security  HTTP headers
// app.use(helmet());

//Limit requests from same IP
// const limiter = rateLimit({
//   max: 50,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);

app.use(
  session({
    secret: "secretpennypartner",
    resave: false, // Forces session to be saved back to the session store
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
//MIDDLEWARES

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow all CRUD methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify headers if needed
  })
);

app.use(compression());
app.use("/", express.static(path.join(__dirname, "..", "frontend")));
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" })); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(cookieParser());

// Data sanitization against NOSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// app.use((req,res,next)=>{
//    console.log(req.headers)
//   next()
// })
app.get("/", product, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "ind.html"));
});
app.use("/api/v1/users", userRoutes);
// app.use("/", userRoutes);
app.get("/auth", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "auth.html"));
});

//OTP VERIFICATION
app.post("/verifyMe", tempUser);

app.all("*", (req, res, next) => {
  // const err = new Error("Cant find " + req.originalUrl + " on this server");
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);
  next(new AppError("Can't find " + req.originalUrl + " on this server", 404));
});

//GLOBAL ERROR HANDLING MIDDLEWARE (GEHM)
app.use(globalErrorHandler);

module.exports = app;
