const db = require("../db/connection");

exports.readCommentsByArticleId = (article_id) => {
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

exports.createCommentInArticle = (commentBody, author, article_id) => {
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

exports.deleteCommentinModel = (comment_id) => {
  return db.query(
    `
      DELETE FROM comments
      WHERE comment_id = $1
    `,
    [comment_id]
  );
};
