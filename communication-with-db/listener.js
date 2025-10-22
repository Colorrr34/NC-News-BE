const express = require("express");
const app = express();
const db = require("../db/connection");

app.listen(9000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to 9000");
  }
});
