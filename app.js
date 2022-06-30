const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const expressRateLimiter = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitizer = require("express-mongo-sanitize");

const path = require("path");

const uploadRouter = require("./routes/upload-router");
const viewRouter = require("./routes/view-router");
const downloadRouter = require("./routes/download-router");

const app = express();

// set security http headers
app.use(helmet());

// limit request for same API for particular user
const limiter = expressRateLimiter({
  windowMs: 60 * 60 * 1000, // 1hr
  max: 100,
  message: "To many request from this IP, please try again later!",
});

app.use("/api", limiter);

// limit amount of data coming in the body
app.use(express.json({ limit: "10kb" }));

// data sanitization again NOSQL query injection
app.use(mongoSanitizer());

// data sanitization against cross-site-scripting attacks (XSS)
app.use(xss());

// log every request in development environment
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// main routes
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/download", downloadRouter);
app.use("/api/v1/view", viewRouter);

// If any route not found, this routes gets executed
app.all("*", (req, res, next) => {
  res.status(404).json({
    error: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
