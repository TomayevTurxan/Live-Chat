const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");

const app = express();
require("dotenv").config();

//APP USE
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);

//CRUD
app.get("/", (req, res) => {
  console.log("req", req);
  res.send("Welcome");
});

const port = process.env.PORT || 5000;

app.listen(port, (req, res) => {
  console.log(`Server running on port..: ${port}`);
});

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDb Connected Succesfully!"))
  .catch((error) => console.log("MongoDb Connected Failed", error.message));
