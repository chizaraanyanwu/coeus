import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import joblib
from textstat import flesch_kincaid_grade  # For readability metrics

# Load dataset
df = pd.read_csv('ielts_writing_dataset.csv')

# Clean and preprocess data
nan_value = float("NaN")
df.replace("", nan_value, inplace=True)
df.dropna(how='all', axis=1, inplace=True)
df.drop_duplicates(inplace=True)

# Ensure the 'Overall' column is numeric
df['Overall'] = df['Overall'].astype(float)

# Add a readability feature
df['readability'] = df['Essay'].apply(flesch_kincaid_grade)

# Define feature and target
X = df[['Essay', 'readability']]  # Include readability as an additional feature
y = df['Overall']

# Convert text data to numerical features using TfidfVectorizer
vectorizer = TfidfVectorizer(stop_words='english')
X_text_vec = vectorizer.fit_transform(X['Essay'])

# Combine text features with readability features
from scipy.sparse import hstack
X_combined = hstack([X_text_vec, X[['readability']]])

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
