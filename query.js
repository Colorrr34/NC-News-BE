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

const getInformationSchema = () => {
  return db
    .query(
      `
      SELECT ccu.table_name, ccu.column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'emoji_article_user'
        `
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows;
    });
};

getInformationSchema().then((data) => {
  return fs.writeFile(
    `${__dirname}/output.json`,
    JSON.stringify(data),
    "utf-8"
  );
});

db.end();
