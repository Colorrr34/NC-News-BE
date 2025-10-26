const { deleteComment } = require("../controllers/request-controller");
const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
