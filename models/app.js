const db = require("../db/connection");
const format = require("pg-format");

const readTopics = () => {
  return db.query("SELECT * FROM topics");
};

const readArticles = (sort_by, order, topic) => {
  return db
    .query(
      format(
        `SELECT articles.*, CAST(count(comments.article_id) AS INTEGER) as comment_count
      FROM articles LEFT JOIN comments
      on articles.article_id = comments.article_id
      WHERE topic LIKE $1 
      GROUP BY articles.article_id
      ORDER BY %I %s `,
        sort_by,
        order
      ),
      [topic]
    )
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
};

const readUsers = () => {
  return db.query("SELECT * FROM users");
};

const readArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT articles.*, CAST(count(comments.article_id) AS integer) as comment_count 
      FROM articles LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id 
    `,
      [article_id]
    )
    .then(({ rows: [article] }) => {
      if (article) {
        return article;
      } else {
        return Promise.reject({
          status: 404,
          msg: `Article Not Found`,
        });
      }
    });
};

const readCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT * 
      FROM comments
      WHERE article_id = $1
    `,
      [article_id]
    )
    .catch((err) => {
      console.log(err);
    });
};

const createCommentInArticle = (commentBody, author, article_id) => {
  return db
    .query(
      `
      INSERT INTO comments(body, author, article_id) 
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [commentBody, author, article_id]
    )
    .catch((err) => {
      return Promise.reject(err);
    });
};

const updateArticleVotes = (inc_votes, article_id) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows;
      } else {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} Does Not Exist`,
        });
      }
    });
};

const deleteCommentinModel = (comment_id) => {
  return db.query(
    `
      DELETE FROM comments
      WHERE comment_id = $1
    `,
    [comment_id]
  );
};

module.exports = {
  readTopics,
  readArticles,
  readUsers,
  readArticleById,
  readCommentsByArticleId,
  createCommentInArticle,
  updateArticleVotes,
  deleteCommentinModel,
};
