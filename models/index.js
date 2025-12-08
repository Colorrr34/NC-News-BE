const { readRowInColumn } = require("./general");
const { readTopics, readTopic } = require("./topics");
const { readUsers } = require("./users");
const {
  readArticles,
  readArticleById,
  updateArticleVotes,
  createArticle,
  verifyReadArticlesQueries,
} = require("./articles");
const {
  readCommentsByArticleId,
  createCommentInArticle,
  updateCommentVotes,
  deleteCommentinModel,
  verifyReadCommentsQueries,
} = require("./comments");

module.exports = {
  readRowInColumn,
  readTopics,
  readTopic,
  readUsers,
  readArticles,
  verifyReadArticlesQueries,
  readArticleById,
  updateArticleVotes,
  createArticle,
  readCommentsByArticleId,
  createCommentInArticle,
  updateCommentVotes,
  deleteCommentinModel,
  verifyReadCommentsQueries,
};
