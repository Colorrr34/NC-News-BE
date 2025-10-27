const { readRowInColumn } = require("./general");
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
  deleteCommentinModel,
} = require("./comments");

module.exports = {
  readRowInColumn,
  readTopics,
  readUsers,
  readArticles,
  readArticleById,
  updateArticleVotes,
  readCommentsByArticleId,
  createCommentInArticle,
  deleteCommentinModel,
};
