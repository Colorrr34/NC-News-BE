const db = require("../connection");
const { format } = require("node-pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics");
    })
    .then(() => {
      return db.query(`
        CREATE TABLE topics(
          slug VARCHAR(20) PRIMARY KEY,
          description VARCHAR(200),
          img_url VARCHAR(1000)
          );`);
    })
    .then(() => {
      return db.query(`
          CREATE TABLE users(
            username VARCHAR(20) PRIMARY KEY,
            name VARCHAR(30),
            avatar_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`
          CREATE TABLE articles(
            article_id SERIAL PRIMARY KEY,
            title VARCHAR(100),
            topic VARCHAR(20) REFERENCES topics(slug),
            author VARCHAR(20) REFERENCES users(username),
            body TEXT,
            created_at TIMESTAMP DEFAULT current_timestamp,
            votes INT DEFAULT 0,
            article_img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return db.query(`
          CREATE TABLE comments(
            comment_id SERIAL PRIMARY KEY,
            article_id INT REFERENCES articles(article_id),
            body TEXT,
            votes INT DEFAULT 0,
            author VARCHAR(20) REFERENCES users(username),
            created_at TIMESTAMP DEFAULT current_timestamp
        );`);
    })
    .then(() => {
      const dataArray = topicData.map(({ slug, description, img_url }) => {
        return [slug, description, img_url];
      });

      const sql = format(
        `INSERT INTO topics(slug, description,img_url) VALUES %L`,
        dataArray
      );
      return db.query(sql);
    })
    .then(() => {
      const dataArray = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
      });

      const sql = format(`INSERT INTO users VALUES %L`, dataArray);
      return db.query(sql);
    })
    .then(() => {
      const dataArray = articleData.map((object) => {
        const {
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        } = require("./utils").convertTimestampToDate(object);
        return [title, topic, author, body, created_at, votes, article_img_url];
      });

      const sql = format(
        `INSERT INTO articles(title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url) VALUES %L`,
        dataArray
      );
      return db.query(sql);
    })
    .then(() => {
      const dataArray = commentData.map((comment) => {
        return require("./utils").convertTimestampToDate(comment);
      });
      return Promise.all(
        dataArray.map((comment) => {
          return require("./utils").getArticleIdByTitle(comment);
        })
      );
    })
    .then((comments) => {
      const dataArray = comments.map(
        ({ article_id, body, votes, author, created_at }) => {
          return [article_id, body, votes, author, created_at];
        }
      );
      const sql = format(
        `INSERT INTO comments(
        article_id, body, votes, author, created_at) VALUES %L`,
        dataArray
      );
      return db.query(sql);
    });
};
module.exports = seed;
