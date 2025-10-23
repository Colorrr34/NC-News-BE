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

  const { rows } = await readArticles(sort_by, order.toUpperCase(), topic);

  res.send(rows);
};

const getUsers = async (req, res) => {
  const { rows: users } = await readUsers();

  res.send(users);
};

const getArticlesById = async (req, res) => {
  const { article_id } = req.params;

  const {
    rows: [article],
  } = await readArticlesbyId(article_id);

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

  const {
    rows: [comment],
  } = await createCommentInArticle(commentBody, author, article_id);

  res.status(201).send(comment);
};

const patchArticleVotes = async (req, res) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  const {
    rows: [article],
  } = await updateArticleVotes(inc_votes, article_id);

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
