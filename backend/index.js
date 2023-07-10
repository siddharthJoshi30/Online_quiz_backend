require("dotenv").config();
const express = require("express");
const mongoose = require("./config/Db/db");
const api = require("./config/API/Auth/APIRoute");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api/v1", api);
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (_, res) => {
  return res.sendFile(
    path.join(__dirname, "client", "build", "index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});
const PORT = process.env.PORT || 4000;
mongoose()
  .then(() => {
    console.log("Connected successfully to db...");
    app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
