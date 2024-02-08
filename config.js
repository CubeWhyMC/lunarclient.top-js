exports.websiteConfig = {
    title: "LunarCN Client | Welcome!", // 默认的题目
    description: "A high performance Minecraft launcher", // 网站介绍
    url: "http://127.0.0.1:3000", // 部署URL

    users: {
        // 重要: 请在实际部署中修改此值
        secret: "114514-1919810", // Cookie签名KEY
        openRegistration: true // 是否开放注册
    }
};

exports.apiConfig = {
    metadata: {
        defaultVersion: "1.8.9",
        // alert
        alert: null,
        modPacks: []
    },
    celestial: {
        enableCrashReport: true // 是否接收错误报告
    },
    launch: {
        defaultMainClass: "com.moonsworth.lunar.genesis.Genesis",
        defaultVMArgs: [
            "--add-modules",
            "jdk.naming.dns",
            "--add-exports",
            "jdk.naming.dns/com.sun.jndi.dns\u003djava.naming",
            "-Djna.boot.library.path\u003dnatives",
            "-Dlog4j2.formatMsgNoLookups\u003dtrue",
            "--add-opens",
            "java.base/java.io\u003dALL-UNNAMED",
            "-XX:+UseStringDeduplication"
        ]
    }
}
