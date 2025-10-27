const {
  readRowInColumn,
  readTopics,
  readUsers,
  readArticles,
  readArticleById,
  updateArticleVotes,
  readCommentsByArticleId,
  createCommentInArticle,
  deleteCommentinModel,
} = require("../models/index");

const getTopics = (req, res) => {
  return readTopics().then(({ rows }) => {
    res.send({ topics: rows });
  });
};

const getArticles = (req, res) => {
  const { sort_by = "created_at", order = "desc", topic = "%%" } = req.query;

  return readArticles(
    sort_by,
    order === "desc" || order === "asc" ? order.toUpperCase() : "DESC",
    topic
  ).then(({ rows }) => {
    res.send({ articles: rows });
  });
};

const getUsers = (req, res) => {
  return readUsers().then(({ rows }) => {
    res.send({ users: rows });
  });
};

const getArticleById = (req, res) => {
  const { article_id } = req.params;

  return readArticleById(article_id).then((article) => {
    res.send(article);
  });
};

const getCommentsByArticleId = (req, res) => {
  const { article_id } = req.params;

  const commentsByArticleId = readCommentsByArticleId(article_id);

  const articleIdCheck = readRowInColumn("articles", "article_id", article_id);

  return Promise.all([commentsByArticleId, articleIdCheck]).then(
    ([commentsByArticleId]) => {
      const { rows } = commentsByArticleId;
      res.send({ articleComments: rows });
    }
  );
};

const postCommentToArticle = (req, res) => {
  const { body: commentBody, author } = req.body;
  const { article_id } = req.params;

  return createCommentInArticle(commentBody, author, article_id).then(
    ({ rows: [comment] }) => {
      res.status(201).send(comment);
    }
  );
};

const patchArticleVotes = (req, res) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  return updateArticleVotes(inc_votes, article_id).then(([article]) => {
    res.send(article);
  });
};

const deleteComment = async (req, res) => {
  const { comment_id } = req.params;

  return readRowInColumn("comments", "comment_id", comment_id)
    .then(() => {
      return deleteCommentinModel(comment_id);
    })
    .then(() => {
      res.status(204).send();
    });
};

module.exports = {
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
  deleteComment,
};
