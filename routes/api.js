const CryptoJS = require("crypto-js")
const {v4: uuidv4} = require('uuid');
const AdmZip = require('adm-zip');

const express = require('express');
const {apiConfig, websiteConfig} = require("../config");
const fs = require("fs");
const router = express.Router();
const encoder = new TextEncoder();

const hashmap = {}

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
    });
    return list;
}

function getModules(subVersion) {
    let list = [];
    let majorVersion = subVersion.split(".").slice(0, 2).join(".");
    let path = `config/versions/${majorVersion}/${subVersion}`;
    let modules = fs.readdirSync(path);
    modules.forEach((module) => {
        let file = `${path}/${module}`;
        let stat = fs.statSync(file);
        if (stat.isFile() && module.endsWith(".json")) {
            let json = JSON.parse(fs.readFileSync(file, "utf-8"));
            list.push({
                id: module.split(".").slice(0, -1).join("."), "default": json["metadata"]["default"]
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
            success: true, launchTypeData: {
                artifacts: getArtifacts(version, module, os, arch).concat(json["launch"]["artifacts"]),
                mainClass: apiConfig.launch.defaultMainClass,
                ichor: true
            }, jre: {
                extraArguments: apiConfig.launch.defaultVMArgs
            }
        };
        return {...out, ...json["launch"]["ext"]};
    }
    return null;
}

function getArtifacts(version, module, os, arch) {
    let list = [findNatives(os, arch)];
    let majorVersion = version.split(".").slice(0, 2).join(".");
    let path = `config/versions/${majorVersion}/${version}/artifacts/${module}`;

    if (!fs.existsSync(path)) return list;

    let artifacts = fs.readdirSync(path);
    artifacts.forEach((artifact) => {
        let file = `${path}/${artifact}`;
        let stat = fs.statSync(file);
        if (stat.isFile() && artifact.endsWith(".jar")) {
            let hash = CryptoJS.SHA1(fs.readFileSync(file)).toString()
            if (!hashmap.hasOwnProperty(hash)) hashmap[hash] = file;
            list.push({
                name: artifact, sha1: hash, url: apiConfig.websiteConfig.url + `/api/download/${hash}`, type: "CLASS_PATH"
            });
        }
    });

    return list.concat(getExternalFiles(version, module));
}

function getExternalFiles(version, module) {
    let list = [];
    let majorVersion = version.split(".").slice(0, 2).join(".");
    let path = `config/versions/${majorVersion}/${version}/artifacts/${module}/external`;

    if (!fs.existsSync(path)) return []; // not found

    let files = fs.readdirSync(path);
    files.forEach((file) => {
        let really = `${path}/${file}`;
        let stat = fs.statSync(really);

        if (stat.isFile() && file.endsWith(".jar")) {
            let hash = CryptoJS.SHA1(fs.readFileSync(really)).toString()
            if (!hashmap.hasOwnProperty(hash)) hashmap[hash] = really
            list.push({
                name: file, sha1: hash, url: apiConfig.websiteConfig.url + `/api/download/${hash}`, type: "EXTERNAL_FILE"
            });
        }
    })

    return list;
}

function findNatives(os, arch) {
    let json = JSON.parse(fs.readFileSync("config/natives.json", "utf-8"))
    let natives = json[os][arch] // example: win32 x64
    return {
        ...natives, "type": "NATIVES"
    }
}

function findFileByHash(hash) {
    let path = hashmap[hash];
    return {
        name: path.split("/")[path.split("/").length - 1], path: path, stream: fs.createReadStream(path)
    };
}

function getAddonType(type) {
    let result;
    switch (type) {
        case "agents":
            result = "Agent";
            break;
        case "weave":
            result = "weave";
            break;
        case "cn":
            result = "cn";
            break;
        case "fabric":
            result = "fabric";
            break;
        default:
            result = type;
            break;
    }
    return result;
}

function getPlugins() {
    let list = [];
    let path = `config/addons`;
    let addonTypes = fs.readdirSync(path);
    addonTypes.forEach((addonType) => {
        let path2 = `${path}/${addonType}`
        fs.readdirSync(path2).forEach((addon) => {
            let addonFile = `${path2}/${addon}`
            let file = fs.readFileSync(addonFile)
            let hash = CryptoJS.SHA1(file).toString()

            if (!hashmap.hasOwnProperty(hash)) hashmap[hash] = addonFile

            let zip = new AdmZip(addonFile);

            let metaJson = zip.getEntry("addon.meta.json");
            let meta = null
            if (metaJson) meta = JSON.parse(metaJson.getData().toString('utf8'))

            list.push({
                name: addon,
                sha1: hash,
                downloadLink: `/download/${hash}`,
                category: getAddonType(addonType),
                meta: meta // 这里包含addon.meta.json的内容或null
            });
        });
    });

    return list;
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
});
router.post("/launcher/launch", (req, res) => {
    let json = req.body
    let version = json["version"];
    let module = json["module"];
    let os = json["os"];
    let arch = json["arch"];

    let versionResult = findVersionInfo(version, module, os, arch);

    res.json(versionResult);
});

router.post("/launcher/uploadCrashReport", (req, res) => {
    if (!apiConfig.celestial.enableCrashReport) {
        res.status(405);
        res.json({
            message: "Crash report upload is disabled! Please enable it in config.js!"
        });
        return;
    }
    let crashId = uuidv4();

    let path = `config/crash-report/${crashId}.json`;
    fs.writeFileSync(path, JSON.stringify({...req.body, time: Date.now()}));

    res.json({
        id: crashId, message: "Successful", url: `${websiteConfig.url}/crash?id=${crashId}`
    });
})

router.get("/game/metadata", (req, res) => {
    // todo 动态生成游戏元数据
    let gameMetadata = JSON.parse(fs.readFileSync("config/game-metadata.json", "utf-8"));
    res.json(gameMetadata)
})

// download

router.get("/download/:hash", (req, res) => {
    let hash = req.params["hash"];

    let file = findFileByHash(hash);
    let fileStream = file.stream
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);

    fileStream.on('open', () => {
        fileStream.pipe(res);
    });

    fileStream.on('error', (err) => {
        console.error(`Error reading file: ${err}`);
        res.status(500).end();
    });
});

// plugins
router.get("/plugins", (req, res) => {
    res.redirect("/plugins"); // redirect to the plugin publish page
});

router.get("/plugins/info", (req, res) => {
    res.json(getPlugins())
})

module.exports = router;
