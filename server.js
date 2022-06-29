const mongoose = require("mongoose");
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

const databaseUrl = process.env.MONGO_DB_URL.replace(
  "<PASSWORD>",
  process.env.MONGO_DB_PASSWORD
);

mongoose
  .connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully!"))
  .catch((error) =>
    console.log(`Error occured while connecting database: ${error}`)
  );

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
