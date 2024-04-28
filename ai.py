import os
import json
import time
from typing import List, Dict, Any
import requests
import random
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()

# Load the ChatGPT API key from an environment variable
CHATGPT_API_KEY = os.getenv("CHATGPT_API_KEY")

# AI model integration
CHATGPT_API_URL = "https://api.openai.com/v1/completions"

def call_chatgpt(prompt: str) -> str:
    """
    Calls the ChatGPT API to generate a response for the given prompt.

    Args:
    prompt (str): The user's prompt or question.

    Returns:
    str: The generated response from ChatGPT.
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {CHATGPT_API_KEY}",
    }
    data = {
        "model": "text-davinci-003",
        "prompt": prompt,
        "max_tokens": 150,
        "temperature": 0.5,
    }
    try:
        response = requests.post(CHATGPT_API_URL, headers=headers, json=data)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()["choices"][0]["text"]
    except requests.exceptions.RequestException as e:
        print(f"Error calling ChatGPT API: {e}")
        return ""

def call_black_box(prompt: str) -> str:
    """
    Calls the proprietary black-box model API to generate a response for the given prompt.

    Args:
    prompt (str): The user's prompt or question.

    Returns:
    str: The generated response from the black-box model.
    """
    # Replace this with your proprietary black-box model API call
    return "Black-box model response"

def generate_response(prompt: str) -> str:
    """
    Generates a response for the given prompt by randomly choosing between ChatGPT and the black-box model.

    Args:
    prompt (str): The user's prompt or question.

    Returns:
    str: The generated response.
    """
    models = [call_chatgpt, call_black_box]
    random.seed(int(time.time()))
    model_response = random.choice(models)(prompt)
    if model_response:
        return model_response
    else:
        return "Sorry, I couldn't generate a response at this time."

# User feedback interface
class Feedback:
    def __init__(self):
        self.ratings = {}

    def provide_feedback(self, interaction_id: str, rating: int, feedback: str) -> None:
        """
        Records user feedback for an interaction.

        Args:
        interaction_id (str): The unique ID of the interaction.
        rating (int): The user's rating (1-5) for the response.
        feedback (str): The user's explicit feedback.
        """
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")
        self.ratings[interaction_id] = {"rating": rating, "feedback": feedback}

# Response prioritization
def prioritize_responses(prompt: str, feedback: Feedback) -> str:
    """
    Generates a response for the given prompt and allows user feedback.

    Args:
    prompt (str): The user's prompt or question.
    feedback (Feedback): The feedback object to record user ratings.

    Returns:
    str: The generated response.
    """
    response = generate_response(prompt)
    interaction_id = str(int(time.time()))
    print(f"Interaction ID: {interaction_id}")
    feedback.provide_feedback(interaction_id, 3, "No explicit feedback provided")  # Default rating is 3 (neutral)
    return response

# Logging Manager
class LoggingManager:
    def __init__(self):
        self.data = []

    def log(self, interaction: Dict[str, Any]) -> None:
        """
        Logs an interaction (prompt, response, and rating) for analysis.

        Args:
        interaction (Dict[str, Any]): The interaction data to log.
        """
        interaction["timestamp"] = int(time.time())
        self.data.append(interaction)

    def save_data(self, file_name: str) -> None:
        """
        Saves the logged interactions to a JSON file.

        Args:
        file_name (str): The name of the file to save the interactions.
        """
        with open(file_name, "w") as file:
            json.dump(self.data, file)

# Error handling
def handle_error(e: Exception) -> str:
    """
    Handles exceptions and provides a generic error message.

    Args:
    e (Exception): The exception to handle.

    Returns:
    str: A generic error message.
    """
    print(f"Error: {e}")
    return f"Sorry, an error occurred. Please try again later. Error details: {str(e)}"

# Web interface
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

@app.route("/")  # Add this route handler
def index():
    return "Hello from your AI Assistant!"

@app.route("/ask", methods=["POST"])
def ask():
    if request.method == "POST":
        data = request.get_json()
        prompt = data.get("prompt", "")
        if prompt:
            feedback = Feedback()
            response = prioritize_responses(prompt, feedback)
            interaction_id = str(int(time.time()))
            feedback.provide_feedback(interaction_id, 3, "No explicit feedback provided")  # Default rating is 3 (neutral)
            return jsonify({"response": response, "interaction_id": interaction_id})
        else:
            return jsonify({"error": "Prompt not provided"}), 400
    else:
        return jsonify({"error": "Method not allowed"}), 405

@app.route("/rate", methods=["POST"])
def rate():
    interaction_id = request.form["interaction_id"]
    rating = int(request.form["rating"])
    feedback = Feedback()
    feedback.provide_feedback(interaction_id, rating, request.form.get("feedback", "No explicit feedback provided"))
    return jsonify({"message": "Rating recorded"})

@app.route("/log", methods=["GET"])
def log_interactions():
    logging_manager = LoggingManager()
    logging_manager.save_data("interactions.json")
    return jsonify({"message": "Interactions logged"})

if __name__ == "__main__":
    app.run(debug=True)
