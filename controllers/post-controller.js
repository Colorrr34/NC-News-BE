const { createCommentInArticle } = require("../models/index");

exports.postCommentToArticle = (req, res) => {
  const { body: commentBody, author } = req.body;
  const { article_id } = req.params;

  return createCommentInArticle(commentBody, author, article_id).then(
    ({ rows: [comment] }) => {
      res.status(201).send(comment);
    }
  );
};
