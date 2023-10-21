const express = require("express");
const betterSQLite3 = require("better-sqlite3");

const api = express.Router();

const _db = betterSQLite3(process.cwd()+"/database.db", { "fileMustExist": true, "verbose": console.log });

const db = {
    getUserById: _db.prepare('SELECT * FROM Accounts WHERE id=?;'),
    addUser: _db.prepare('INSERT INTO Accounts (username, password, first_name, second_name, gender, about, interests) VALUES (@username, @password, @first_name, @second_name, @gender, @about, @interests);'),
    getUserIdByName: _db.prepare('SELECT id FROM Accounts WHERE username=?;'),
    getProjectById: _db.prepare('SELECT * FROM Projects WHERE id=?;')
}

api.get("/user/:id", (req, res) => {
    try {
        const { id } = req.params;
        let user = db.getUserById.get(id);
        if (user) {
            res.json(user).end();
        } else {
            res.status(404).end();
        }
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

api.post("/user/create", express.urlencoded({ extended: true }), (req, res) => {
    try {
        db.addUser.run(req.body);
        let userid = db.getUserIdByName.get(req.body.username);
        if (userid) {
            res.json(userid).end();
        } else {
            res.status(500).end();
        }
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

module.exports = api;