const {
  getTopics,
  getArticles,
  getUsers,
  getUserByUsername,
  getArticleById,
  getCommentsByArticleId,
} = require("./get-controller");

const { postCommentToArticle } = require("./post-controller");

const { patchArticleVotes, patchCommentVote } = require("./patch-controller");

const { deleteComment } = require("./delete-controller");

module.exports = {
  getTopics,
  getArticles,
  getUsers,
  getUserByUsername,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
  patchCommentVote,
  deleteComment,
};
