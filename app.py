from flask import Flask, render_template, request
import requests, os

app = Flask(__name__)

AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        prompt = request.form["prompt"]

        url = f"{AZURE_OPENAI_ENDPOINT}/openai/images/generations:submit?api-version=2024-02-01"
        headers = {"api-key": AZURE_OPENAI_KEY, "Content-Type": "application/json"}
        data = {"model": "dall-e-3", "prompt": prompt, "size": "1024x1024"}

        try:
            response = requests.post(url, headers=headers, json=data)
            result = response.json()
            image_url = result["data"][0]["url"]
            return render_template("result.html", prompt=prompt, image_url=image_url)
        except Exception as e:
            return f"Error: {str(e)}"

    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
