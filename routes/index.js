const fs = require("fs");
const express = require('express');
const {websiteConfig} = require("../config");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: websiteConfig["title"],
        description: websiteConfig["description"]
    });
});

function getCrashReportList() {
    let list = [];
    fs.readdirSync("config/crash-report").forEach((report) => {
        list.push(report.slice(0, report.lastIndexOf('.')));
    });
    return list;
}

function getCrashReport(id) {
    let path = `config/crash-report/${id}.json`;
    if (!fs.existsSync(path)) return null;
    return JSON.parse(fs.readFileSync(path, "utf-8"));
}

router.get("/crash", (req, res) => {
    let crashID = req.query["id"];
    if (!crashID) {
        res.render("crash/index", {
            id: crashID,
            reports: getCrashReportList()
        });
    } else {
        let result = getCrashReport(crashID);
        if (result) {
            res.render("crash/result", {
                crashID: crashID,
                ...result
            });
        } else {
            res.render("crash/result", {
                crashID: "not-found",
                trace: `Crash ID ${crashID} not found`,
                type: "web",
                time: new Date().getTime(),
                launchScript: null
            });
        }
    }
})

router.get('/download/:v', function (req, res) {
    res.redirect("https://github.com/CubeWhyMC/celestial/releases/" + req.params.v);
});


router.get("/thanks", function (req, res) {
    res.render("thanks"); // process link in the frontend
})

router.get("/download", (req, res) => {
    res.render('download', {
        api: process.env.backend
    });
})

router.get('/help', function (req, res, next) {
    res.redirect("https://mc.lunarclient.top/docs"); // by xrk
});

router.get("/donate", function (req, res) {
    res.render("donate", {})
});

router.get("/plugins", (req, res) => {
    res.render("plugins");
});

module.exports = router;
