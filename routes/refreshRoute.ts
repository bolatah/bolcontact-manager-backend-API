import express from "express";

const refreshRoute = express.Router();

const RefreshController = require("../controllers/refreshController");

const refreshController = new RefreshController();

refreshRoute.get("/refresh", refreshController.handleRefreshToken);

module.exports = refreshRoute;
