const express = require("express");
const router = express.Router();

// setting up database
const mongs = require("mongoose");
mongs.set("strictQuery", false);
require("dotenv").config(); // load .env data
const db_uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@dbclst0.fadtg3n.mongodb.net/mini-msg-board?retryWrites=true&w=majority`;

mongs
    .connect(db_uri)
    .then(() => console.log("-- connected to db"))
    .catch((err) => console.error(err.message));

const MessageModel = require("../models/message");

/* GET home page. */
router.get("/", function (req, res, next) {
    // query db for all messages
    MessageModel.find({})
        .exec()
        .then((results) => {
            res.render("index", {
                title: "Mini-Messaging Board",
                messages: results,
            });
        })
        .catch((err) => handleServerError(err, res));
});

/* GET & POST add new user */
router
    .route("/new")
    .get(function (req, res, next) {
        res.render("form", {
            title: "Add new message",
            formHeader: "Draft new message",
        });
    })
    .post(function (req, res, next) {
        // save message to db
        db_add_msg(
            req.body.msgText,
            req.body.author,
            new Date()
        ).catch((err) => handleServerError(err, res));

        // go back home
        res.redirect("/");
    });

// handle 404
router.use(async function (req, res, next) {
    res.writeHead(404);
    res.end("I am so sorry but that page has never existed, mn!");
    // await mongs.connection.close();
});

// error handler for route, /
router.use(async function (err, req, res, next) {
    await mongs.connection.close();
});

async function db_add_msg(text, user, added) {
    const msg = new MessageModel({
        text_msg: text,
        user_name: user,
        added: added,
    });

    await msg
        .save()
        .then(function () {
            console.log(
                `-- added new message[ text: ${text}, username: ${user}, added: ${added} ]...`
            );
        })
        .catch((err) => {
            console.error(`DB error: ${err}`);
            return;
        });
}

function handleServerError(err, res) {
    console.error(`DB error: ${err}`);

    res.writeHead(500);
    res.end("code 500: internal server error!");
    return;
}

module.exports = router;
