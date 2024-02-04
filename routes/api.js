const express = require('express');
const {apiConfig} = require("../config");
const fs = require("fs");
const router = express.Router();

function getBlogposts() {
    return JSON.parse(fs.readFileSync("./config/blogposts.json", "utf-8"));
}

function getVersions() {
    let path = "config/versions";
    let files = fs.readdirSync(path);
    let versions = [];
    files.forEach((versionID) => {
        let stat = fs.statSync(`${path}/${versionID}`);
        if (stat.isDirectory()) {
            versions.push({
                id: versionID,
                "default": apiConfig.metadata.defaultVersion.split(".").slice(0, 2).join(".") === versionID,
                subversions: getSubVersions(versionID)
            });
        }
    });
    return versions;
}

function getSubVersions(version) {
    let path = `config/versions/${version}`;
    let list = [];
    let versions = fs.readdirSync(`config/versions/${version}`);
    versions.forEach((subVersion) => {
        let stat = fs.statSync(`${path}/${subVersion}`);
        if (stat.isDirectory()) {
            list.push({
                id: subVersion,
                "default": apiConfig.metadata.defaultVersion === subVersion,
                modules: getModules(version, subVersion)
            });
        }
    })
    return list;
}

function getModules(version, subVersion) {
    let list = [];
    let path = `config/versions/${version}/${subVersion}`;
    let modules = fs.readdirSync(path);
    modules.forEach((module) => {
        let file = `${path}/${module}`
        let stat = fs.statSync(file);
        if (stat.isFile() && module.endsWith(".json")) {
            let json = JSON.parse(fs.readFileSync(file, "utf-8"))
            list.push({
                id: module.split(".").slice(0, -1).join("."),
                "default": json["metadata"]["default"]
            })
        }
    })
    return list;
}

router.get("/", (req, res) => {
    // redirect to documents
    res.redirect("/help")
})

router.get("/launcher/metadata", (req, res) => {
    // read config/artifacts
    let json = {
        // versions: [
        //     {
        //         "id": "1.8",
        //         "default": true,
        //         "subversions": [
        //             {
        //                 "id": "1.8.9",
        //                 "default": true,
        //                 "assets": {
        //                     "id": "1.8",
        //                     "url": "https://launchermeta.mojang.com/v1/packages/f6ad102bcaa53b1a58358f16e376d548d44933ec/1.8.json",
        //                     "sha1": "f6ad102bcaa53b1a58358f16e376d548d44933ec"
        //                 },
        //                 "modules": [
        //                     {
        //                         "id": "lunar",
        //                         "default": true,
        //                         "name": "Lunar + OptiFine",
        //                         "description": "Lunar bundled with OptiFine. OptiFine is an optimization mod that allows Minecraft to run faster and look better.",
        //                         "credits": "sp614x",
        //                         "image": "https://launcherimages.lunarclientcdn.com/cdn-cgi/image/format=auto,width=40,height=40/modules/optifine.png"
        //                     },
        //                     {
        //                         "id": "forge",
        //                         "default": false,
        //                         "name": "Lunar + Forge",
        //                         "description": "Lunar bundled with the Forge mod loader and a selection of Forge mods. Includes OptiFine, Replay Mod, NotEnoughUpdates, and SkyblockAddons.",
        //                         "credits": "",
        //                         "image": "https://launcherimages.lunarclientcdn.com/cdn-cgi/image/format=auto,width=40,height=40/modules/forge.png"
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // ],
        versions: getVersions(),
        blogPosts: getBlogposts(),
        alert: apiConfig.metadata.alert,
        modpacks: apiConfig.metadata.modPacks
    }
    res.json(json)
})

router.get("/launcher/launch", (req, res) => {

})

module.exports = router;
