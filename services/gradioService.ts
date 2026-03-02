import { Client } from "@gradio/client";

const HF_SPACE = "AUXteam/tiny_factory";

export class GradioService {
  private static client: any = null;

  static async getClient() {
    if (!this.client) {
      // Use HF Token from environment if available (set via vite define or process.env)
      // For browser, we check if it was injected during build
      const token = (import.meta as any).env?.VITE_HF_TOKEN || null;
      this.client = await Client.connect(HF_SPACE, token ? { hf_token: token } : {});
    }
    return this.client;
  }

  static async identifyPersonas(context: string) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/identify_personas", [context]);
      return result.data[0];
    } catch (error) {
      console.error("Error identifying personas:", error);
      throw error;
    }
  }

  static async startSimulationAsync(simulationId: string, contentText: string, format: string = "text") {
    try {
      const client = await this.getClient();
      const result = await client.predict("/start_simulation_async", [simulationId, contentText, format]);
      return result.data[0];
    } catch (error) {
      console.error("Error starting simulation:", error);
      throw error;
    }
  }

  static async getSimulationStatus(simulationId: string) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/get_simulation_status", [simulationId]);
      return result.data[0];
    } catch (error) {
      console.error("Error getting simulation status:", error);
      throw error;
    }
  }

  static async generateVariants(contentText: string, numVariants: number = 3) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/generate_variants", [contentText, numVariants]);
      return result.data[0];
    } catch (error) {
      console.error("Error generating variants:", error);
      return ["Unable to generate variants at this time."];
    }
  }

  static async listSimulations() {
    try {
      const client = await this.getClient();
      const result = await client.predict("/list_simulations", []);
      return result.data[0];
    } catch (error) {
      console.error("Error listing simulations:", error);
      return [];
    }
  }

  static async generatePersonas(businessDescription: string, customerProfile: string, numPersonas: number = 1) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/generate_personas", [businessDescription, customerProfile, numPersonas, null]);
      return result.data[0];
    } catch (error) {
      console.error("Error generating personas:", error);
      throw error;
    }
  }

  static async generateSocialNetwork(name: string, personaCount: number = 10, networkType: string = "scale_free", focusGroupName: string | null = null) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/generate_social_network", [name, personaCount, networkType, focusGroupName]);
      return result.data[0];
    } catch (error) {
      console.error("Error generating social network:", error);
      throw error;
    }
  }

  static async getNetworkGraph(simulationId: string) {
    try {
      const client = await this.getClient();
      const result = await client.predict("/get_network_graph", [simulationId]);
      return result.data[0];
    } catch (error) {
      console.error("Error getting network graph:", error);
      throw error;
    }
  }
}
