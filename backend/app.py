import sys
import os
import gradio as gr
import json
from tinytroupe.factory import TinyPersonFactory
from tinytroupe.utils.semantics import select_best_persona
from huggingface_hub import hf_hub_download, upload_file

# NEW IMPORTS for Simulation and Analytics
from tinytroupe.simulation_manager import SimulationManager, SimulationConfig
from tinytroupe.agent.social_types import Content

HF_TOKEN = os.getenv("HF_TOKEN") # Ensure this is set in Space secrets
REPO_ID = os.getenv("HF_REPO_ID", "harvesthealth/tiny_factory")
PERSONA_BASE_FILE = "persona_base.json"

# Initialize Simulation Manager
simulation_manager = SimulationManager()

def load_persona_base():
    if not HF_TOKEN:
        print("HF_TOKEN not found, persistence disabled.")
        return []
    try:
        path = hf_hub_download(repo_id=REPO_ID, filename=PERSONA_BASE_FILE, repo_type="space", token=HF_TOKEN)
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading persona base: {e}")
        return []

def save_persona_base(personas):
    if not HF_TOKEN:
        print("HF_TOKEN not found, skipping upload.")
        return
    with open(PERSONA_BASE_FILE, 'w', encoding='utf-8') as f:
        json.dump(personas, f, indent=4)
    try:
        upload_file(
            path_or_fileobj=PERSONA_BASE_FILE,
            path_in_repo=PERSONA_BASE_FILE,
            repo_id=REPO_ID,
            repo_type="space",
            token=HF_TOKEN
        )
    except Exception as e:
        print(f"Error saving persona base to Hub: {e}")

# --- Persona Generation ---
def generate_personas(business_description, customer_profile, num_personas, blablador_api_key=None):
    api_key_to_use = blablador_api_key or os.getenv("BLABLADOR_API_KEY")

    if not api_key_to_use:
        return {"error": "BLABLADOR_API_KEY not found. Please provide it in your API call or set it as a secret in the Space settings."}

    original_key = os.getenv("BLABLADOR_API_KEY")

    try:
        os.environ["BLABLADOR_API_KEY"] = api_key_to_use
        num_personas = int(num_personas)

        factory = TinyPersonFactory(
            context=business_description,
            sampling_space_description=customer_profile,
            total_population_size=num_personas
        )

        people = factory.generate_people(number_of_people=num_personas, parallelize=False)
        personas_data = [person._persona for person in people]

        current_base = load_persona_base()
        current_base.extend(personas_data)
        save_persona_base(current_base)

        return personas_data

    except Exception as e:
        return {"error": str(e)}

    finally:
        if original_key is None:
            if "BLABLADOR_API_KEY" in os.environ:
                del os.environ["BLABLADOR_API_KEY"]
        else:
            os.environ["BLABLADOR_API_KEY"] = original_key


def find_best_persona(criteria):
    personas = load_persona_base()
    if not personas:
        return {"error": "Persona base is empty. Generate some personas first!"}

    try:
        idx = select_best_persona(criteria=criteria, personas=personas)
        try:
            idx = int(idx)
        except (ValueError, TypeError):
            return {"error": f"LLM returned an invalid index: {idx}"}

        if idx >= 0 and idx < len(personas):
            return personas[idx]
        else:
            return {"error": f"No matching persona found for criteria: {criteria}"}
    except Exception as e:
        return {"error": f"Error during persona matching: {str(e)}"}

# --- Simulation Management ---
def create_simulation(name, persona_count, network_type):
    try:
        config = SimulationConfig(
            name=name,
            persona_count=int(persona_count),
            network_type=network_type
        )
        simulation = simulation_manager.create_simulation(config)
        return {
            "id": simulation.id,
            "name": simulation.config.name,
            "status": simulation.status,
            "persona_count": len(simulation.personas)
        }
    except Exception as e:
        return {"error": str(e)}

def run_simulation(simulation_id, content_text):
    try:
        content = Content(text=content_text)
        result = simulation_manager.run_simulation(simulation_id, content)
        return {
            "total_reach": result.total_reach,
            "expected_likes": result.expected_likes,
            "expected_comments": result.expected_comments,
            "expected_shares": result.expected_shares,
            "execution_time": result.execution_time,
            "engagement_rate": result.engagement_rate
        }
    except Exception as e:
        return {"error": str(e)}

# --- Engagement and Content ---
def predict_engagement(persona_name, content_text, simulation_id):
    try:
        simulation = simulation_manager.get_simulation(simulation_id)
        if not simulation:
             return {"error": f"Simulation {simulation_id} not found."}

        persona = next((p for p in simulation.personas if p.name == persona_name), None)
        if not persona:
            return {"error": f"Persona {persona_name} not found in simulation."}

        content = Content(text=content_text)
        prob = simulation_manager.predictor.predict(persona, content, simulation.network)

        return {
            "persona": persona_name,
            "content_preview": content_text[:50] + "...",
            "engagement_probability": prob,
            "verdict": "Likely to engage" if prob > 0.5 else "Unlikely to engage"
        }
    except Exception as e:
        return {"error": str(e)}

def generate_content_variants(original_content, num_variants=5):
    try:
        variants = simulation_manager.variant_generator.generate_variants(
            original_content,
            num_variants=int(num_variants)
        )
        return [
            {
                "text": v.text,
                "strategy": v.strategy,
                "parameters": v.parameters
            } for v in variants
        ]
    except Exception as e:
        return {"error": str(e)}

# --- Network Analytics ---
def get_network_metrics(simulation_id):
    try:
        simulation = simulation_manager.get_simulation(simulation_id)
        if not simulation:
             return {"error": f"Simulation {simulation_id} not found."}

        metrics = simulation.network.get_metrics()
        return metrics
    except Exception as e:
        return {"error": str(e)}


with gr.Blocks() as demo:
    gr.Markdown("<h1>Tiny Factory & Artificial Societies</h1>")

    with gr.Tab("Persona Generation"):
        with gr.Row():
            with gr.Column():
                business_description_input = gr.Textbox(label="What is your business about?", lines=5)
                customer_profile_input = gr.Textbox(label="Information about your customer profile", lines=5)
                num_personas_input = gr.Number(label="Number of personas to generate", value=1, minimum=1, step=1)
                blablador_api_key_input = gr.Textbox(label="Blablador API Key (for API client use)", visible=False)
                generate_button = gr.Button("Generate Personas")
            with gr.Column():
                personas_output = gr.JSON(label="Generated Personas")

        generate_button.click(
            fn=generate_personas,
            inputs=[business_description_input, customer_profile_input, num_personas_input, blablador_api_key_input],
            outputs=personas_output,
            api_name="/generate_personas"
        )

    with gr.Tab("Social Simulation"):
        with gr.Row():
            with gr.Column():
                sim_name = gr.Textbox(label="Simulation Name", value="My Social Simulation")
                sim_persona_count = gr.Number(label="Number of Personas", value=10)
                sim_network_type = gr.Dropdown(label="Network Type", choices=["scale_free", "professional"], value="scale_free")
                create_sim_button = gr.Button("Create Simulation")

                gr.Markdown("---")
                run_sim_id = gr.Textbox(label="Simulation ID (to run)")
                run_content = gr.Textbox(label="Content to Test", lines=3)
                run_sim_button = gr.Button("Run Simulation")

            with gr.Column():
                sim_status_output = gr.JSON(label="Simulation Status/Results")

        create_sim_button.click(
            fn=create_simulation,
            inputs=[sim_name, sim_persona_count, sim_network_type],
            outputs=sim_status_output,
            api_name="/create_simulation"
        )

        run_sim_button.click(
            fn=run_simulation,
            inputs=[run_sim_id, run_content],
            outputs=sim_status_output,
            api_name="/run_simulation"
        )

    with gr.Tab("Engagement Prediction"):
        with gr.Row():
            with gr.Column():
                pred_persona_name = gr.Textbox(label="Persona Name")
                pred_content_text = gr.Textbox(label="Content Text", lines=3)
                pred_sim_id = gr.Textbox(label="Simulation ID")
                predict_button = gr.Button("Predict Engagement")
            with gr.Column():
                prediction_output = gr.JSON(label="Prediction Result")

        predict_button.click(
            fn=predict_engagement,
            inputs=[pred_persona_name, pred_content_text, pred_sim_id],
            outputs=prediction_output,
            api_name="/predict_engagement"
        )

    with gr.Tab("Content Engine"):
        with gr.Row():
            with gr.Column():
                orig_content = gr.Textbox(label="Original Content", lines=5)
                num_variants = gr.Number(label="Number of Variants", value=5)
                gen_variants_button = gr.Button("Generate Variants")
            with gr.Column():
                variants_output = gr.JSON(label="Content Variants")

        gen_variants_button.click(
            fn=generate_content_variants,
            inputs=[orig_content, num_variants],
            outputs=variants_output,
            api_name="/generate_content_variants"
        )

    with gr.Tab("Network Analytics"):
        with gr.Row():
            with gr.Column():
                metrics_sim_id = gr.Textbox(label="Simulation ID")
                get_metrics_button = gr.Button("Get Network Metrics")
            with gr.Column():
                metrics_output = gr.JSON(label="Network Analytics")

        get_metrics_button.click(
            fn=get_network_metrics,
            inputs=[metrics_sim_id],
            outputs=metrics_output,
            api_name="/get_network_metrics"
        )

    with gr.Tab("Search Tresor"):
        with gr.Row():
            with gr.Column():
                criteria_input = gr.Textbox(label="Criteria to find best matching persona", lines=2)
                find_button = gr.Button("Find Best Persona in Tresor")
            with gr.Column():
                find_output = gr.JSON(label="Matched Persona")

        find_button.click(
            fn=find_best_persona,
            inputs=[criteria_input],
            outputs=find_output,
            api_name="find_best_persona"
        )

if __name__ == "__main__":
    demo.queue().launch()
