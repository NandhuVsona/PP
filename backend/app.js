const express = require("express");
const app = express();
const path = require("path");
const userRoutes = require("./routes/userRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const analysRoutes = require("./routes/analysRoutes.js");
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
const passport = require("./utils/passportSetup.js");

// const dotenv = require("dotenv");
// require("dotenv").config();
// dotenv.config({ path: path.join(__dirname, ".env") });

const {
  product,
  tempUser,
  signup,
  createSendToken,
} = require("./controllers/authController.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const User = require("./models/userModel.js");

console.log(createSendToken)

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

// app.use((req, res, next) => {
//   console.log(req.user);
//   next();
// });
// Middleware

// Import the configured passport instance

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    console.log(req.user);
    let isExist = await User.findOne({ email: req.user.emails[0].value });
    if (!isExist) {
      let newUser = await User.create({
        username: req.user.displayName,
        email: req.user.emails[0].value,
        password: "00000000",
        provider: req.user.provider,
      });
      createSendToken(newUser, 201, res);
      // await createDefaultData(newUser._id);
      // await TempUsers.findByIdAndDelete(tempUser._id);
    } else {
      createSendToken(isExist, 200, res);
    }
  }
);


app.get("/", product, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/analytics", analysRoutes);

//OTP VERIFICATION
// app.post("/verifyMe", tempUser);

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
