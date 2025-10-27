const { readRowInColumn, deleteCommentinModel } = require("../models/index");

exports.deleteComment = (req, res) => {
  const { comment_id } = req.params;

  return readRowInColumn("comments", "comment_id", comment_id, "Comment")
    .then(() => {
      return deleteCommentinModel(comment_id);
    })
    .then(() => {
      res.status(204).send();
    });
};
