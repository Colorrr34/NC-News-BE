const db = require("../db/connection");

exports.readTopics = () => {
  return db.query("SELECT * FROM topics");
};

exports.readTopic = (topic) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [topic])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Topic not found" });
      return rows;
    });
};
