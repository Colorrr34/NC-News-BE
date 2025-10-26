const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
} = require("../controllers/request-controller");

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentToArticle);

module.exports = articlesRouter;
