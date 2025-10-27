const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/index");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
