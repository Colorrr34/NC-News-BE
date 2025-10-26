const apiRouter = require("express").Router();
const comments = require("../db/data/test-data/comments");
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");

apiRouter.get("/", (req, res) => {
  res.send({ msg: "Welcome to NC News" });
});

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
