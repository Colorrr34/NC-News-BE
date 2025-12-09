const db = require("../db/connection");

exports.readCommentsByArticleId = (article_id, limit, page) => {
  return db
    .query(
      `
      SELECT * 
      FROM comments
      WHERE article_id = $1
    `,
      [article_id]
    )
    .then(({ rows }) => {
      const paginatedRows = rows.reduce(
        (acc, cur) => {
          const currentPage = Object.keys(acc).length;
          if (acc[currentPage].length < limit) {
            acc[currentPage].push(cur);
          } else {
            acc[currentPage + 1] = [cur];
          }
          return acc;
        },
        { 1: [] }
      );
      const lastPage = Object.keys(paginatedRows).length;
      if (!paginatedRows[page]) {
        return Promise.reject({
          status: 404,
          msg: `Page Not Found. The last page is ${lastPage}.`,
        });
      }
      return {
        comments: paginatedRows[page],
        total_count: rows.length,
        page: page,
      };
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.verifyReadCommentsQueries = (limit, page) => {
  if (Math.sign(page) !== 1 || Math.sign(limit) !== 1) {
    return Promise.reject({ status: 400, msg: "Invalid Queries" });
  }
  return Promise.resolve();
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
      switch (err.code) {
        case "23503":
          const resErr = { status: 404 };
          if (err.constraint === "comments_article_id_fkey") {
            resErr.msg = "Article Not Found";
          } else if (err.constraint === "comments_author_fkey") {
            resErr.msg = "User Not Found";
          }
          return Promise.reject(resErr);
        case "23502":
          return Promise.reject({ status: 400, msg: "Missing Required Keys" });
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
