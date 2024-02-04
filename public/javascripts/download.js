$(document).ready(function() {
    $(".downloadButton").on("click", function() {
        swal("正在为您选取下载地址！", "选择完毕后将会为您自动下载", "success")
        $.get("https://api.github.ink/repos/CubeWhyMC/celestial/releases/latest", function(data) {
            if (data.assets.length > 0) {
                const version = data.tag_name;
                const versionJar = data.tag_name.replace(/^v/, "");
                const downloadUrl = "https://github.com/CubeWhyMC/celestial/releases/download/" + version + "/celestial-" + versionJar + "-SNAPSHOT-fatjar.jar";
                const downloadUrl2 = "https://github.ink/CubeWhyMC/celestial/releases/download/" + version + "/celestial-" + versionJar + "-SNAPSHOT-fatjar.jar";

                console.log("GitHub Release Tag: " + version);
                console.log("GitHub Release Download URL (github.com): " + downloadUrl);
                console.log("GitHub Release Download URL (github.ink): " + downloadUrl2);

                const githubComUrl = downloadUrl;
                const githubInkUrl = downloadUrl2;

                measureSpeed(githubComUrl, function(githubComSpeed) {
                    measureSpeed(githubInkUrl, function(githubInkSpeed) {
                        console.log("GitHub.com Speed: " + githubComSpeed + " ms");
                        console.log("GitHub.ink Speed: " + githubInkSpeed + " ms");

                        const finalDownloadUrl = (githubComSpeed < githubInkSpeed) ? githubComUrl : githubInkUrl;

                        console.log("Selected Download URL: " + finalDownloadUrl);

                        window.location.href = finalDownloadUrl;
                    });
                });
            } else {
                console.error("No assets found in the latest release.");
            }
        });
    });

    function measureSpeed(url, callback) {
        const startTime = new Date().getTime();

        fetch(url, { mode: 'no-cors' })
            .then(response => {
                const endTime = new Date().getTime();
                const speed = endTime - startTime;
                console.log("Speed measured for " + url + ": " + speed + " ms");
                callback(speed);
            })
            .catch(error => {
                console.log("Failed to measure speed for " + url);
                callback(Number.MAX_SAFE_INTEGER);
            });
    }
});