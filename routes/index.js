const express = require("express");
const router = express.Router();

const msgs = [
    {
        text: "hi there!",
        user: "Amando",
        added: new Date(),
    },
    {
        text: "hello world!",
        user: "Charles",
        added: new Date(),
    },
];

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", {
        title: "Mini-Messaging Board",
        messages: msgs,
    });
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
        // save message to an ephemeral db
        msgs.push({
            text: req.body.msgText,
            user: req.body.author,
            added: new Date(),
        });

        // go back home
        res.redirect("/");
    });

module.exports = router;
