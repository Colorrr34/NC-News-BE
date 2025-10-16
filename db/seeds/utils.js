const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.getArticleIdByTitle = ({ article_title, ...otherProperties }) => {
  if (!article_title) return { ...otherProperties };
  let title = article_title;
  if (/\'/.test(article_title)) {
    title = article_title.split("'").join("''");
  }
  const id = db.query(
    `
    SELECT article_id FROM articles
    WHERE title = '${title}'
    `
  );

  return Promise.all([id, otherProperties])
    .then(([data, otherProperties]) => {
      return { article_id: data.rows[0].article_id, ...otherProperties };
    })
    .catch(() => {
      console.log(title);
    });
};
