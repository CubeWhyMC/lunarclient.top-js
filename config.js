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
        defaultMainClass: "com.moonsworth.lunar.genesis.Genesis"
    },
    api: {
        deploy: "http://127.0.0.1:3000/api"
    }
}
