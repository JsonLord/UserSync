
import { Client } from "@gradio/client";

const APP_SOURCE = "AUXteam/tiny_factory";

class GradioService {
  private client: Promise<any>;

  constructor() {
    this.client = Client.connect(APP_SOURCE);
  }

  async generatePersonas(businessDescription: string, customerProfile: string, numPersonas: number = 1, blabladorApiKey: string | null = null) {
    const client = await this.client;
    const result = await client.predict("/generate_personas", {
      business_description: businessDescription,
      customer_profile: customerProfile,
      num_personas: numPersonas,
      blablador_api_key: blabladorApiKey,
    });
    return result.data[0];
  }

  async findBestPersona(criteria: string) {
    const client = await this.client;
    const result = await client.predict("/find_best_persona", {
      criteria: criteria,
    });
    return result.data[0];
  }

  async generateSocialNetwork(name: string, personaCount: number = 10, networkType: "scale_free" | "small_world" = "scale_free", focusGroupName: string | null = null) {
    const client = await this.client;
    const result = await client.predict("/generate_social_network", {
      name: name,
      persona_count: personaCount,
      network_type: networkType,
      focus_group_name: focusGroupName,
    });
    return result.data[0];
  }

  async predictEngagement(simulationId: string, contentText: string, format: string = "text") {
    const client = await this.client;
    const result = await client.predict("/predict_engagement", {
      simulation_id: simulationId,
      content_text: contentText,
      format: format,
    });
    return result.data[0];
  }

  async startSimulationAsync(simulationId: string, contentText: string, format: string = "text") {
    const client = await this.client;
    const result = await client.predict("/start_simulation_async", {
      simulation_id: simulationId,
      content_text: contentText,
      format: format,
    });
    return result.data[0];
  }

  async getSimulationStatus(simulationId: string) {
    const client = await this.client;
    const result = await client.predict("/get_simulation_status", {
      simulation_id: simulationId,
    });
    return result.data[0];
  }

  async sendChatMessage(simulationId: string, message: string, sender: string = "User") {
    const client = await this.client;
    const result = await client.predict("/send_chat_message", {
      simulation_id: simulationId,
      sender: sender,
      message: message,
    });
    return result.data[0];
  }

  async getChatHistory(simulationId: string) {
    const client = await this.client;
    const result = await client.predict("/get_chat_history", {
      simulation_id: simulationId,
    });
    return result.data[0];
  }

  async generateVariants(contentText: string, numVariants: number = 5) {
    const client = await this.client;
    const result = await client.predict("/generate_variants", {
      content_text: contentText,
      num_variants: numVariants,
    });
    return result.data[0];
  }

  async listSimulations() {
    const client = await this.client;
    const result = await client.predict("/list_simulations", {});
    return result.data[0];
  }

  async listPersonas(simulationId: string) {
    const client = await this.client;
    const result = await client.predict("/list_personas", {
      simulation_id: simulationId,
    });
    return result.data[0];
  }

  async getPersona(simulationId: string, personaName: string) {
    const client = await this.client;
    const result = await client.predict("/get_persona", {
      simulation_id: simulationId,
      persona_name: personaName,
    });
    return result.data[0];
  }

  async deleteSimulation(simulationId: string) {
    const client = await this.client;
    const result = await client.predict("/delete_simulation", {
      simulation_id: simulationId,
    });
    return result.data[0];
  }

  async exportSimulation(simulationId: string) {
    const client = await this.client;
    const result = await client.predict("/export_simulation", {
      simulation_id: simulationId,
    });
    return result.data[0];
  }

  async getNetworkGraph(simulationId: string) {
    const client = await this.client;
    const result = await client.predict("/get_network_graph", {
      simulation_id: simulationId,
    });
    return result.data[0];
  }

  async listFocusGroups() {
    const client = await this.client;
    const result = await client.predict("/list_focus_groups", {});
    return result.data[0];
  }

  async saveFocusGroup(name: string, simulationId: string) {
    const client = await this.client;
    const result = await client.predict("/save_focus_group", {
      name: name,
      simulation_id: simulationId,
    });
    return result.data[0];
  }
}

export const gradioService = new GradioService();
