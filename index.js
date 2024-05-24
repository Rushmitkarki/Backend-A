// Importing the package (Express package)
const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const acceptFormData = require("express-fileupload");

// creataing an express application

const app = express();

//  Express json configuration
app.use(express.json());

//  config form data
app.use(acceptFormData());

// dotenv Confurigation
dotenv.config();

// Connecting to database

connectDatabase();

// Defining the port

const PORT = process.env.PORT;

//  cors configuration
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Making a test endpoint
// Endpoint : Post, GET, PUT, DElETE
// need path in get

//

app.get("/test", (req, res) => {
  res.send("Test API is working.....");
});

app.get("/hello", (req, res) => {
  res.send("This is the second page......");
});
// http://localhost:5000/api/user

// configuring Routes of user

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/product", require("./routes/productRoutes"));

//  Starting the server

app.listen(PORT, () => {
  console.log(`Serverrrr is running on PORT ${PORT}...`);
});
