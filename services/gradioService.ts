import { Client } from "@gradio/client";

const HF_SPACE = "AUXteam/tiny_factory";

export class GradioService {
  private static client: any = null;

  static async getClient() {
    if (!this.client) {
      this.client = await Client.connect(HF_SPACE);
    }
    return this.client;
  }

  static async identifyPersonas(context: string) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/identify_personas", [context]);
      return result.data;
    } catch (error) {
      console.error("Error identifying personas:", error);
      throw error;
    }
  }

  static async simulate(persona: string, message: string) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/simulate", [persona, message]);
      return result.data;
    } catch (error) {
      console.error("Error in simulation:", error);
      throw error;
    }
  }

  static async helpMeCraft(content: string) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/help_me_craft", [content]);
      return result.data;
    } catch (error) {
      console.error("Error helping to craft content:", error);
      return "Unable to craft content at this time.";
    }
  }
}
