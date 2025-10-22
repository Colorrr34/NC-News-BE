const express = require("express");
const app = express();
const db = require("./db/connection");

app.get("/api/topics", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM topics");

  res.send(rows);
});

app.get("/api/articles", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM articles");
  const commentResult = await db.query("SELECT article_id FROM comments");
  const commentCount = {};

  commentResult.rows.forEach((comment) => {
    if (commentCount[comment.article_id]) {
      commentCount[comment.article_id]++;
    } else {
      commentCount[comment.article_id] = 1;
    }
  });

  rows.forEach((article) => {
    if (commentCount[article.article_id]) {
      article.comment_count = commentCount[article.article_id];
    } else {
      article.comment_count = 0;
    }
  });

  res.send(rows);
});

module.exports = app;
