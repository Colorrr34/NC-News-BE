const db = require("../db/connection");
const {
  readTopics,
  readArticles,
  readUsers,
  readArticlesbyId,
  readCommentsByArticleId,
  createCommentInArticle,
  updateArticleVotes,
  deleteCommentinModel,
} = require("../models/app");

const getTopics = async (req, res) => {
  const { rows: topics } = await readTopics();

  res.send(topics);
};

const getArticles = async (req, res) => {
  const { sort_by = "created_at", order = "desc", topic = "%%" } = req.query;

  const { rows: articles } = await readArticles(
    sort_by,
    order.toUpperCase(),
    topic
  );

  res.send(articles);
};

const getUsers = async (req, res) => {
  const { rows: users } = await readUsers();

  res.send(users);
};

const getArticlesById = async (req, res) => {
  const { article_id } = req.params;

  const article = await readArticlesbyId(article_id);

  res.send(article);
};

const getCommentsByArticleId = async (req, res) => {
  const { article_id } = req.params;

  const { rows: articleComments } = await readCommentsByArticleId(article_id);

  res.send(articleComments);
};

const postCommentToArticle = async (req, res) => {
  const { body: commentBody, author } = req.body;
  const { article_id } = req.params;
  let comment;

  try {
    const {
      rows: [result],
    } = await createCommentInArticle(commentBody, author, article_id);
    comment = result;
  } catch (err) {
    if (err.code === "23503") {
      res.status(404).send({ msg: `Article ${article_id} Does Not Exist` });
    } else {
      res.status(500).send({ msg: "Internet Server Error" });
    }
  }

  res.status(201).send(comment);
};

const patchArticleVotes = async (req, res) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  let article;

  try {
    const [result] = await updateArticleVotes(inc_votes, article_id);
    article = result;
  } catch (err) {
    if (err.status === 404) {
      res.status(404).send({ msg: err.msg });
    }
  }

  res.send(article);
};

const deleteComment = async (req, res) => {
  const { comment_id } = req.params;

  await deleteCommentinModel(comment_id);

  res.status(204).send();
};

module.exports = {
  getTopics,
  getArticles,
  getUsers,
  getArticlesById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
  deleteComment,
};
