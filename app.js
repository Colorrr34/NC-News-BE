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
} = require("./controllers/request-controller");
const {
  invalidPathHandler,
  errorStatusHandler,
  psqlErrorHandler,
  status500Handler,
} = require("./controllers/error-handler");
const apiRouter = require("./routers/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.use(invalidPathHandler);

app.use(errorStatusHandler);

app.use(psqlErrorHandler);

app.use(status500Handler);

module.exports = app;
