from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.corpus import words as nltk_words
from nltk import word_tokenize


#The dataset code
import joblib
import numpy as np
from textstat import flesch_kincaid_grade
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from scipy.sparse import hstack


#Importing stemmer 
from nltk.stem import PorterStemmer
from spellchecker import SpellChecker
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

#Initializing spellcheck
spell = SpellChecker()

# Initialize the lemmatizer and stopwords
lemmatizer = WordNetLemmatizer()
english_stopwords = set(stopwords.words('english'))

# Load the trained model and vectorizer
model = joblib.load('text_analysis.pkl')
vectorizer = joblib.load('vectorizer.pkl')


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Basic text as an example that flask server is working 
@app.route('/')
def hello():
    return jsonify({'message': 'Hello, Flask!'})

# Spellcheck method 
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


#Processing the text users input 
def preprocess_text(text):
    # Tokenize the text
    word_tokens = word_tokenize(text)
    
    # Remove stopwords and lemmatize
    filtered_words = [lemmatizer.lemmatize(word.lower()) for word in word_tokens if word.lower() not in english_stopwords and word.isalpha()]
    
    return ' '.join(filtered_words)

# Loading text into prediction model 
def test_model(input):
    # Load the trained model and vectorizer
    model = joblib.load('text_analysis.pkl')
    vectorizer = joblib.load('vectorizer.pkl')
    
    # Preprocess the input text
    processed_text = preprocess_text(input)
    
    # Convert the processed text to numerical features using the vectorizer
    text_vec = vectorizer.transform([processed_text])
    
    # Compute the readability score for the input text
    readability = np.array([[flesch_kincaid_grade(input)]])
    
    # Combine text features with readability feature
    X_test_combined = hstack([text_vec, readability])
    
    # Make prediction
    prediction = model.predict(X_test_combined)
    
    return prediction[0]

@app.route('/analysis', methods=['POST', 'GET'])
def text_analysis():
    # Example usage
    example = request.get_json("force=true")
    input_text = example['text']  # Extract the text from the JSON data
    
    if not example or 'text' not in example:
        return jsonify({'error': 'No text provided'}), 400  # Return an error if no text is provided

    # input_text = "Poverty represents a worldwide crisis. It is the ugliest epidemic in a region, which could infect countries in the most debilitating ways. To tackle this issue, rich countries need to help those in need and give a hand when possible. I agree that there are several ways of aiding poor countries other than financial aid, like providing countries in need with engineers, workers, and soldiers who would build infrastructure. Building universities, hospitals, and roadways. By having a solid infrastructure, poor countries would be able to monetise their profits and build a stronger and more profitable economy which would help them in the long term. Once unprivilged countries find their niche, the major hurdle would be passed and would definitely pave the way for much brighter future. However, I do disagree that financial aid does not solve poverty, it does if used properly and efficiently. The most determining factor if financial aid would be the way to go, is by identifying what type of poor countries' representative are dealing with. Some countries will have a responsible leader and some will not, with that being said, implementing a strategy, to distinguish responsible leaders from others, would tailor the type of aid rich countries could use. An example, A clear report and constant observation would be applied to track the progress and how this type of aid is being monetized. In summary, types of aid varies from country to another, and tailoring the type of aid is of paramount importance to solve this problem that had huge toll on poor countries."
    predicted_score = test_model(input_text)
    rounded_number = round(predicted_score, 2) / 9 * 100


    return jsonify({'predicted_score': rounded_number})


    # try:
    #     data = request.get_json()
    #     essay = data.get('essay')
    #     prompt = data.get('prompt')  # Prompt is not used directly in the model
        
    #     # Check if the input is valid
    #     if not essay:
    #         return jsonify({'error': 'No essay provided'}), 400
        
    #     # Preprocess the essay
    #     df = pd.DataFrame({'Essay': [essay]})
    #     df['readability'] = df['Essay'].apply(lambda x: 0)  # Dummy readability feature for now

    #     # Vectorize the essay
    #     essay_vec = vectorizer.transform(df['Essay'])
    #     readability_vec = df[['readability']].values

    #     # Combine features
    #     X_combined = hstack([essay_vec, readability_vec])
        
    #     # Predict the score
    #     score = model.predict(X_combined)
        
    #     return jsonify({'score': score[0]})
    
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)



