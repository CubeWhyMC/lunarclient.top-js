let express = require('express');
let router = express.Router();
const {websiteConfig} = require("../config");
const mongoose = require("mongoose");
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/lunarcn');

router.use(session({
    secret: websiteConfig.users.secret,
    resave: false,
    saveUninitialized: true,
}));

router.get('/', async (req, res) => {
    if (req.session.user) {
        if (req.query.hasOwnProperty("flush")) {
            req.session.user = await User.findOne({
                $or: [{username: req.session.user.username}, {email: req.session.user.email}]
            });
            return res.redirect("/users"); // do redirect
        }
        let info = {
            username: req.session.user.username,
            email: req.session.user.email,
            mcIgn: req.session.user.mcIgn
        };
        if (req.query.page) {
            res.render(`users/pages/${req.query.page}`, info)
        } else {
            res.render("users/dashboard", info);
        }
    } else if (req.query.hasOwnProperty("register")) {
        if (websiteConfig.users.openRegistration) {
            res.render("users/register");
        } else {
            res.json({
                message: "注册已关闭!"
            })
        }
    } else {
        let msgCode = 0;
        if (req.query.hasOwnProperty("wrong-credentials")) msgCode = 1;
        res.render("users/login", {
            msgCode: msgCode
        });
    }
})

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    mcIgn: String
});

const User = mongoose.model('User', userSchema);

router.get("/login", (req, res) => {
    res.redirect("/users");
});

router.post("/login", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const existingUser = await User.findOne({
        $or: [{username: req.body.username}, {email: req.body.email}]
    });

    if (!existingUser) {
        return res.status(400).redirect("/users?wrong-credentials")
    }
    req.session.user = existingUser;
    res.redirect("/users");
});

router.get("/register", (req, res) => {
    res.redirect("/users");
});

router.post("/register", async (req, res) => {
    if (!websiteConfig.users.openRegistration) return res.status(415).json({
        message: "注册已关闭!"
    })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const existingUser = await User.findOne({
        $or: [{username: req.body.username}, {email: req.body.email}]
    });

    if (existingUser) {
        return res.status(409).json({message: "用户名或电子邮件已存在"});
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            mcIgn: "*unset*"
        });

        await user.save();
        req.session.user = user
        res.status(201).redirect("/users")
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "注册失败，请重试!"
        });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/users")
});

router.post("/passwd-reset", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // 查找用户
    const user = await User.findOne({
        $or: [{username: req.session.user.username}, {email: req.session.user.email}]
    });

    if (!user) {
        return res.status(404).json({message: "未登录"});
    }
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();

    res.redirect("/users"); // success
});

router.post("/bindmc", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const user = await User.findOne({
        $or: [{username: req.session.user.username}, {email: req.session.user.email}]
    });

    if (!user) {
        return res.status(404).json({message: "未登录"});
    }

    user.mcIgn = req.body["ign"];

    await user.save();
    res.redirect("/users?flush"); // success
})

module.exports = router;
