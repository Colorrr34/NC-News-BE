const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/request-controller");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
