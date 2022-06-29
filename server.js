const dotenv = require("dotenv");
const fs = require("fs");

if (!fs.existsSync("uploads/")) {
  fs.mkdirSync("uploads");
}

process.on("uncaughtException", (error) => {
  console.log("UNCAUGHT EXCEPTION | SHUTTING DOWN...");
  if (process.env.NODE_ENV === "development") console.log(error);
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

process.on("unhandledRejection", (error) => {
  console.log(`UNHANDLED REJECTION | SHUTTING DOWN ...`);
  if (process.env.NODE_ENV === "development") console.log(error);
  server.close(() => {
    process.exit(1);
  });
});
