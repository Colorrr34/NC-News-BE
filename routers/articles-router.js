const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
  postArticle,
} = require("../controllers/index");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentToArticle);

module.exports = articlesRouter;
