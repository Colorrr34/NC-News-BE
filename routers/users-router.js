const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/request-controller");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
