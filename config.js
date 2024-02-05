exports.websiteConfig = {
    title: "LunarCN Client | Welcome!",
    description: "A high performance Minecraft launcher"
};

exports.apiConfig = {
    metadata: {
        defaultVersion: "1.8.9",
        // alert
        alert: null,
        modPacks: [
        ]
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
    },
    api: {
        deploy: "http://127.0.0.1:3000/api"
    }
}
