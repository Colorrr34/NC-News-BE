const {
  readRowInColumn,
  readTopics,
  readUsers,
  readArticleById,
  readArticles,
  readCommentsByArticleId,
  verifyReadArticlesQueries,
  verifyReadCommentsQueries,
} = require("../models/index");

exports.getTopics = (req, res) => {
  return readTopics().then(({ rows }) => {
    res.send({ topics: rows });
  });
};

exports.getArticles = (req, res) => {
  const {
    sort_by = "created_at",
    order = "desc",
    topic = "%%",
    limit = 10,
    p: page = 1,
  } = req.query;

  return verifyReadArticlesQueries(order, limit, page, topic, sort_by)
    .then(() => {
      return readArticles(sort_by, order, topic, limit, +page);
    })
    .then((result) => {
      res.send(result);
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
    res.send({ article: article });
  });
};

exports.getCommentsByArticleId = (req, res) => {
  const { limit = 10, p: page = 1 } = req.query;
  const { article_id } = req.params;

  return verifyReadCommentsQueries(limit, page)
    .then(() => {
      const commentsByArticleId = readCommentsByArticleId(
        article_id,
        limit,
        page
      );
      const articleIdCheck = readRowInColumn(
        "articles",
        "article_id",
        article_id,
        "Article"
      );
      return Promise.all([commentsByArticleId, articleIdCheck]);
    })
    .then(([commentsByArticleId]) => {
      res.send(commentsByArticleId);
    });
};
