# importing the nltk suite  
import nltk 
  
# importing jaccard distance 
# and ngrams from nltk.util 
from nltk.metrics.distance import jaccard_distance 
from nltk.util import ngrams

# Downloading and importing 
# package 'words' from nltk corpus 
nltk.download('words') 
from nltk.corpus import words 
  
  
correct_words = words.words()