const express = require("express");
const app = express();
const db = require("./db/connection");

app.use(express.json());

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

app.get("/api/users", async (req, res) => {
  const { rows } = await db.query("SELECT * FROM users");

  res.send(rows);
});

app.get("/api/articles/:article_id", async (req, res) => {
  const { article_id } = req.params;
  const { rows } = await db.query(
    `
      SELECT * 
      FROM articles
      WHERE article_id = $1
    `,
    [article_id]
  );

  res.send(rows);
});

app.get("/api/articles/:article_id/comments", async (req, res) => {
  const { article_id } = req.params;
  const { rows } = await db.query(
    `
      SELECT * 
      FROM comments
      WHERE article_id = $1
    `,
    [article_id]
  );

  res.send(rows);
});

app.post("/api/articles/:article_id/comments", async (req, res) => {
  const { body: commentBody, author } = req.body;
  const { article_id } = req.params;
  const { rows } = await db.query(
    `
      INSERT INTO comments(body, author, article_id) 
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [commentBody, author, article_id]
  );

  res.status(201).send(rows);
});

module.exports = app;
