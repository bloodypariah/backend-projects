const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const punycode = require("punycode/");

// Set port
const port = 4001;

//Create server app
const app = express();

// TaskRoutes
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");

//Database Connection
mongoose.connect(
  "mongodb+srv://admin:admin@b330coran.mipcxvk.mongodb.net/Capstone2_API?retryWrites=true&w=majority",
);
let connect = mongoose.connection;
connect.on("error", console.error.bind(console, "Connection Error!"));
connect.once("open", () => console.log("Connected with the db!"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/b1/user", userRoutes);
app.use("/b1/product", productRoutes);

//Run and text server
app.listen(port, () => console.log(`API is now online on port ${port}!`));
