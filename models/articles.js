const db = require("../db/connection");
const format = require("pg-format");
const { readTopic } = require("./topics");

exports.readArticles = (sort_by, order, topic, limit, page) => {
  return db
    .query(
      format(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(count(comments.article_id) AS INTEGER) as comment_count
      FROM articles LEFT JOIN comments
      on articles.article_id = comments.article_id
      WHERE topic LIKE $1 
      GROUP BY articles.article_id
      ORDER BY %I %s `,
        sort_by,
        order.toUpperCase()
      ),
      [topic]
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
        articles: paginatedRows[page],
        total_count: rows.length,
        page: page,
      };
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.verifyReadArticlesQueries = (order, limit, page, topic, sort_by) => {
  if (
    !["asc", "desc"].includes(order) ||
    Math.sign(page) !== 1 ||
    Math.sign(limit) !== 1
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Queries" });
  }
  if (
    ![
      "article_id",
      "topic",
      "author",
      "votes",
      "article_img_url",
      "created_at",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Sort" });
  }
  if (topic === "%%") return Promise.resolve();
  return readTopic(topic).then(() => Promise.resolve());
};

exports.readArticleById = (article_id) => {
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

exports.updateArticleVotes = (inc_votes, article_id) => {
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
          msg: `Article Not Found`,
        });
      }
    });
};

exports.createArticle = ({
  title,
  topic,
  author,
  body,
  article_img_url = "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg",
}) => {
  return db
    .query(
      `
      INSERT INTO articles(title, topic, author, body, article_img_url)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
    `,
      [title, topic, author, body, article_img_url]
    )
    .catch((err) => {
      if (err.code === "23503") {
        return Promise.reject({
          status: 400,
          msg: "Invalid input for username or topic",
        });
      }
    });
};
