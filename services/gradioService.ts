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

  static async startSimulationAsync(simulationId: string, contentText: string, format: string = "text") {
    try {
      const client = await this.getClient();
      const result = await client.predict("/start_simulation_async", [simulationId, contentText, format]);
      return result.data;
    } catch (error) {
      console.error("Error starting simulation:", error);
      throw error;
    }
  }

  static async getSimulationStatus(simulationId: string) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/get_simulation_status", [simulationId]);
      return result.data;
    } catch (error) {
      console.error("Error getting simulation status:", error);
      throw error;
    }
  }

  static async generateVariants(contentText: string, numVariants: number = 3) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/generate_variants", [contentText, numVariants]);
      return result.data;
    } catch (error) {
      console.error("Error generating variants:", error);
      return ["Unable to generate variants at this time."];
    }
  }

  static async listSimulations() {
    try {
      const client = await this.getClient();
      const result = await client.predict("/list_simulations", []);
      return result.data;
    } catch (error) {
      console.error("Error listing simulations:", error);
      return [];
    }
  }
}
