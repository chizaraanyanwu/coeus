from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.corpus import words as nltk_words
from nltk import word_tokenize

# importing jaccard distance 
# and ngrams from nltk.util 
from nltk.metrics.distance import jaccard_distance 
from nltk.util import ngrams

# Downloading and importing 
# package 'words' from nltk corpus 
from nltk.corpus import words 

#Importing stemmer 
from nltk.stem import PorterStemmer
from spellchecker import SpellChecker


import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

spell = SpellChecker()


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/')
def hello():
    return jsonify({'message': 'Hello, Flask!'})

@app.route('/spellcheck', methods=['GET', 'POST'])
def spellcheck():
    data = request.get_json("force=true")  # Get JSON data from the request
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400  # Return an error if no text is provided

    text = data['text']  # Extract the text from the JSON data
    words = word_tokenize(text)  # Tokenize the text into words
    
    # Initialize SpellChecker
    spell = SpellChecker()
    
    # Find misspelled words
    misspelled_words = spell.unknown(words)
    
    # Get corrected words
    corrected_words = {word: list(spell.candidates(word)) for word in misspelled_words}

    response = {
        'misspelled_words': list(misspelled_words),
        'corrected_words': corrected_words
    }
    
    print("Response Data:", response)  # Debug print statement
    return jsonify(response)


# Load the trained model and vectorizer
model = joblib.load('text_analysis.pkl')
vectorizer = joblib.load('vectorizer.pkl')

@app.route('/analysis', methods=['POST', 'GET'])
def text_analysis():
    try:
        data = request.get_json()
        essay = data.get('essay')
        prompt = data.get('prompt')  # Prompt is not used directly in the model
        
        # Check if the input is valid
        if not essay:
            return jsonify({'error': 'No essay provided'}), 400
        
        # Preprocess the essay
        df = pd.DataFrame({'Essay': [essay]})
        df['readability'] = df['Essay'].apply(lambda x: 0)  # Dummy readability feature for now

        # Vectorize the essay
        essay_vec = vectorizer.transform(df['Essay'])
        readability_vec = df[['readability']].values

        # Combine features
        X_combined = hstack([essay_vec, readability_vec])
        
        # Predict the score
        score = model.predict(X_combined)
        
        return jsonify({'score': score[0]})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
