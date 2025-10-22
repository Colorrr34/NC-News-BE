const express = require("express");
const app = express();
const db = require("../db/connection");

app.get("/api/topics", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM topics");

  res.send(rows);
});

module.exports = app;
