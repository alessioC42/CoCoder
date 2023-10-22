const express = require("express");
const betterSQLite3 = require("better-sqlite3");
const Fuse = require('fuse.js');

const api = express.Router();

const _db = betterSQLite3(process.cwd()+"/database.db", { "fileMustExist": true, "verbose": console.log });


const db = {
    getUserById: _db.prepare('SELECT * FROM Accounts WHERE id=?;'),
    addUser: _db.prepare('INSERT INTO Accounts (username, password, first_name, second_name, gender, about, interests, email) VALUES (@username, @password, @first_name, @second_name, @gender, @about, @interests, @email);'),
    getUserIdByName: _db.prepare('SELECT id FROM Accounts WHERE username=?;'),
    getUserIdByEmailAndPassword: _db.prepare('SELECT id FROM Accounts WHERE email=@email AND password=@password'),
    getProjectById: _db.prepare('SELECT * FROM Projects WHERE id=?;'),
    addProject: _db.prepare('INSERT INTO Projects (owner, title, about, languages, topics) VALUES (@userID, @title, @about, @languages, @topics);'),
    getProjectsFromUserID: _db.prepare('SELECT id FROM Projects WHERE owner=?;')
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

api.get("/user/:id/projects", (req, res) => {
    try {
        const { id } = req.params;
        let data = db.getProjectsFromUserID.all(id);
        if (data) {
            res.json(data).end();
        } else {
            res.status(404).end();
        }
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }

})

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

api.post("/login", express.urlencoded({ extended: true }), (req, res) => {
    try {
        let userid = db.getUserIdByEmailAndPassword.get(req.body);
        if (userid) {
            res.json(userid).end();
        } else {
            res.status(401).send("Account not found!").end();
        }
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
})

api.get("/projects/:id", (req, res) => {
    try {
        const { id } = req.params;
        let project = db.getProjectById.get(id);
        if (project) {
            res.json(project).end();
        } else {
            res.status(404).end();
        }
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

api.post("/projects/create", express.urlencoded({ extended: true }), (req, res) => {
    try {
        db.addProject.run(req.body);
        res.end();
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

api.get("/explore/search", (req, res) => {
    try {
        const { q } = req.query; // Get the search query from the client request
        if (q) {
            // Perform the search in the FTS table
            const searchStmt = _db.prepare(`
            SELECT *
            FROM Projects_fts
            WHERE Projects_fts MATCH @searchQuery
        `);

            const searchResults = searchStmt.all({ searchQuery: q });

            const fuse = new Fuse(searchResults, {
                keys: ["title", "about", "languages", "topics"],
                includeScore: true,
                threshold: 0.6,
            });

            const fuzzyResults = fuse.search(q);

            res.json(fuzzyResults).end();
        } else {
            res.json([]).end();
        }

    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});


module.exports = api;