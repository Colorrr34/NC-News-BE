const { readRowInColumn, verifyInputType } = require("./general");
const { readTopics } = require("./topics");
const { readUsers } = require("./users");
const {
  readArticles,
  readArticleById,
  updateArticleVotes,
} = require("./articles");
const {
  readCommentsByArticleId,
  createCommentInArticle,
  updateCommentVotes,
  deleteCommentinModel,
} = require("./comments");

module.exports = {
  readRowInColumn,
  verifyInputType,
  readTopics,
  readUsers,
  readArticles,
  readArticleById,
  updateArticleVotes,
  readCommentsByArticleId,
  createCommentInArticle,
  updateCommentVotes,
  deleteCommentinModel,
};
