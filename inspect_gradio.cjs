
const { Client } = require("@gradio/client");

async function inspect() {
    try {
        const client = await Client.connect("AUXteam/tiny_factory");
        console.log("Keys:", Object.keys(client));
        if (client.view_api) {
            const api = await client.view_api();
            console.log(JSON.stringify(api, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}

inspect();
