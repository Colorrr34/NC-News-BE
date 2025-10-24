const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
  deleteComment,
} = require("./controllers/app");
const {
  invalidPathHandler,
  errorStatusHandler,
  psqlErrorHandler,
  status500Handler,
} = require("./controllers/error-handler");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(invalidPathHandler);

app.use(errorStatusHandler);

app.use(psqlErrorHandler);

app.use(status500Handler);

module.exports = app;
