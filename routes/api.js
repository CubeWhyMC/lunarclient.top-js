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
                modules: getModules(subVersion)
            });
        }
    })
    return list;
}

function getModules(subVersion) {
    let list = [];
    let majorVersion = subVersion.split(".").slice(0, 2).join(".");
    let path = `config/versions/${majorVersion}/${subVersion}`;
    let modules = fs.readdirSync(path);
    modules.forEach((module) => {
        let file = `${path}/${module}`
        let stat = fs.statSync(file);
        if (stat.isFile() && module.endsWith(".json")) {
            let json = JSON.parse(fs.readFileSync(file, "utf-8"));
            list.push({
                id: module.split(".").slice(0, -1).join("."),
                "default": json["metadata"]["default"]
            });
        }
    });
    return list;
}

function findVersionInfo(version, module, os, arch) {
    let majorVersion = version.split(".").slice(0, 2).join(".");
    let path = `config/versions/${majorVersion}/${version}/${module}.json`;
    if (fs.existsSync(path)) {
        let json = JSON.parse(fs.readFileSync(path, "utf-8"));
        let out = {
            success: true,
            launchTypeData: {
                artifacts: getArtifacts(version, module, os, arch).concat(json["launch"]["artifacts"]),
                mainClass: apiConfig.launch.defaultMainClass,
                ichor: true
            }
        }
        return {...out, ...json["launch"]["ext"]}
    }
    return null
}

function getArtifacts(version, module, os, arch) {
    // todo get artifacts
    return [
        findNatives(os, arch)
    ]
}

function findNatives(os, arch) {
    let json = JSON.parse(fs.readFileSync("config/natives.json", "utf-8"))
    let natives = json[os][arch] // example: win32 x64
    return {
        ...natives,
        "type": "NATIVES"
    }
}

router.get("/", (req, res) => {
    // redirect to documents
    res.redirect("/help");
})

router.get("/launcher/metadata", (req, res) => {
    // read config/artifacts
    let json = {
        versions: getVersions(),
        blogPosts: getBlogposts(),
        alert: apiConfig.metadata.alert,
        modpacks: apiConfig.metadata.modPacks
    };
    res.json(json);
})

router.post("/launcher/launch", (req, res) => {
    let json = req.body
    let version = json["version"];
    let module = json["module"];
    let os = json["os"];
    let arch = json["arch"];

    let versionResult = findVersionInfo(version, module, os, arch)

    res.json(versionResult)
})

module.exports = router;
