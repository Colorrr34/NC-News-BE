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
      if (err.code === "23503") {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return Promise.reject(err);
    });
};

exports.updateCommentVotes = (inc_votes, comment_id) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *
    `,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows;
      } else {
        return Promise.reject({
          status: 404,
          msg: `Comment Not Found`,
        });
      }
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
