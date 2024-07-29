from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.corpus import words as nltk_words
from nltk import word_tokenize
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/')
def hello():
    return jsonify({'message': 'Hello, Flask!'})

@app.route('/spellcheck', methods=['POST', 'GET'])
def spellcheck():
    data = request.get_json()  # Get JSON data from the request
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400  # Return an error if no text is provided

    text = data['text']  # Extract the text from the JSON data
    words = word_tokenize(text)  # Tokenize the text into words
    misspelled_words = [word for word in words if word.lower() not in nltk_words.words()]  # Check for misspelled words

    return jsonify({'misspelled_words': misspelled_words})

if __name__ == '__main__':
    app.run(debug=True)
