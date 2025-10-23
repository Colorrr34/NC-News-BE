const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  getTopics,
  getArticles,
  getUsers,
  getArticlesById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
  deleteComment,
} = require("./controllers/app");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

module.exports = app;
