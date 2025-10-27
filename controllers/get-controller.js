const {
  readRowInColumn,
  readTopics,
  readUsers,
  readArticleById,
  readArticles,
  readCommentsByArticleId,
} = require("../models/index");

exports.getTopics = (req, res) => {
  return readTopics().then(({ rows }) => {
    res.send({ topics: rows });
  });
};

exports.getArticles = (req, res) => {
  const { sort_by = "created_at", order = "desc", topic = "%%" } = req.query;

  return readArticles(sort_by, order, topic).then(({ rows }) => {
    res.send({ articles: rows });
  });
};

exports.getUsers = (req, res) => {
  return readUsers().then(({ rows }) => {
    res.send({ users: rows });
  });
};

exports.getUserByUsername = (req, res) => {
  const { username } = req.params;

  return readRowInColumn("users", "username", username, "User").then((rows) => {
    res.send({ user: rows });
  });
};

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;

  return readArticleById(article_id).then((article) => {
    res.send(article);
  });
};

exports.getCommentsByArticleId = (req, res) => {
  const { article_id } = req.params;

  const commentsByArticleId = readCommentsByArticleId(article_id);
  const articleIdCheck = readRowInColumn(
    "articles",
    "article_id",
    article_id,
    "Article"
  );

  return Promise.all([commentsByArticleId, articleIdCheck]).then(
    ([commentsByArticleId]) => {
      const { rows } = commentsByArticleId;
      res.send({ articleComments: rows });
    }
  );
};
