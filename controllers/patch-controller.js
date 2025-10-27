const { updateArticleVotes, updateCommentVotes } = require("../models/index");

exports.patchArticleVotes = (req, res) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  return updateArticleVotes(inc_votes, article_id).then(([article]) => {
    res.send(article);
  });
};

exports.patchCommentVote = (req, res) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  return updateCommentVotes(inc_votes, comment_id).then(([comment]) => {
    res.send(comment);
  });
};
