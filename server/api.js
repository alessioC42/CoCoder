const express = require("express");
const better_sqlite3 = require("better-sqlite3");

const api = express.Router();

api.get("/test", (req, res) => {
    res.send("test").end();
});

module.exports = api;