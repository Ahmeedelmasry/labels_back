require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const axios = require("axios");
const { ObjectId } = require("mongodb");

// Routes
const user = require("./routes/users");
const labels = require("./routes/labels");
const auth = require("./routes/auth");

// Set Headers
app.use((req, res, next) => {
  res
    .header("Access-Control-Allow-Origin", "*")
    .header("Access-Control-Allow-Methods", "GET, POST, HEAD, PUT, DELETE")
    .header(
      "Access-Control-Allow-Headers",
      "auth-token, Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    .header("Access-Control-Allow-Credentials", true);
  next();
});

//Config
app.use(bodyParser.json());

//Cookie Parser
app.use(cookieParser());

// Routes
app.use("/auth", auth);
app.use("/users", user);
app.use("/labels", labels);

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

//Socket io
const http = require("http");
const httpServer = http.createServer(app);

//Starting server

//Database Connection
mongoose
  .set("strictQuery", true)
  .connect(process.env.DB_URI)
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log(`Listining at port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.log(err));
