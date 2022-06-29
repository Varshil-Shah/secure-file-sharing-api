const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limiter");
const xss = require("xss-clean");
const mongoSanitizer = require("express-mongo-sanitize");

const app = express();

// set security http headers
app.use(helmet());

// limit request for same API for particular user
const limiter = rateLimiter({
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

// main routes

// If any route not found, this routes gets executed
app.all("*", (req, res, next) => {
  res.status(404).json({
    error: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
