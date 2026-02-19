
import { Client } from "@gradio/client";

async function inspect() {
    const client = await Client.connect("AUXteam/tiny_factory");
    console.log(JSON.stringify(client.config.endpoints, null, 2));
}

inspect();
