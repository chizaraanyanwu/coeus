import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import joblib
from textstat import flesch_kincaid_grade  # For readability metrics

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Get English stopwords
english_stopwords = set(stopwords.words('english'))

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    # Tokenize the text
    word_tokens = word_tokenize(text)
    
    # Remove stopwords and lemmatize
    filtered_words = [lemmatizer.lemmatize(word.lower()) for word in word_tokens if word.lower() not in english_stopwords and word.isalpha()]
    
    return ' '.join(filtered_words)

# Load dataset
df = pd.read_csv('ielts_writing_dataset.csv')

# Clean and preprocess data
nan_value = float("NaN")
df.replace("", nan_value, inplace=True)
df.dropna(how='all', axis=1, inplace=True)
df.drop_duplicates(inplace=True)

# Ensure 'Essay' and 'Overall' columns exist
if 'Essay' not in df.columns or 'Overall' not in df.columns:
    raise ValueError("The dataset must contain 'Essay' and 'Overall' columns.")

# Apply preprocessing to the 'Essay' column
df['processed_Essay'] = df['Essay'].apply(preprocess_text)

# Add a readability feature
df['readability'] = df['Essay'].apply(flesch_kincaid_grade)

# Define feature and target
X_text = df['processed_Essay']
y = df['Overall']

# Convert text data to numerical features using TfidfVectorizer
vectorizer = TfidfVectorizer(stop_words='english')
X_text_vec = vectorizer.fit_transform(X_text)

# Convert readability to a 2D array for concatenation
X_readability = df[['readability']].values

# Combine text features with readability features
from scipy.sparse import hstack
X_combined = hstack([X_text_vec, X_readability])

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_combined, y, test_size=0.4, random_state=42)

# Train a regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse}")

# Save the model and vectorizer
joblib.dump(model, 'text_analysis.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')
