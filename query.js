const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const data = require("./db/data/development-data/index");
const fs = require("fs/promises");

const getUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

const getArticlesByTopic = (topic) => {
  return db
    .query(`SELECT * FROM articles WHERE topic = '${topic}'`)
    .then(({ rows }) => {
      return rows;
    });
};

const getCommentsByVotes = () => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id <20`)
    .then(({ rows }) => {
      return rows;
    });
};

const getAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

getCommentsByVotes().then((data) => {
  console.log(data);
});
