"use strict";

// Load modules
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const routes = require("./routes/index");

// Set the port
app.set("port", process.env.PORT || 5000);

// Use body-parser to parse the body of all POST requests
app.use(bodyParser.json());

// Use morgan for HTTP request logging
app.use(morgan("dev"));

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// Connect to the database
mongoose.connect("mongodb://localhost:27017/course-api");

const db = mongoose.connection;

// Handle database connection error
db.on("error", err => console.error(`DB Connection Error: ${err}`));

// On database connection
db.once("open", () => console.log("DB Connection Successful"));

// Main routes here
app.use("/api", routes);

// Greeting message for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Course Review API"
  });
});

// Uncomment this route in order to test the global error handler
// app.get("/error", function (req, res) {
//   throw new Error("Test error");
// });

// Not Found (404) Route
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// Start listening on a port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
