const { patchCommentVote, deleteComment } = require("../controllers/index");
const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVote)
  .delete(deleteComment);

module.exports = commentsRouter;
