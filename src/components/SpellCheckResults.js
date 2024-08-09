// SpellCheckResults.js
import React from "react";
import "../css/SpellCheckResults.css"; // Import the CSS for styling

//The list showing all the spell check information 
const SpellCheckResults = ({ data }) => {
  return (
    <div className="spellcheck_results">
      {/* if there are no misspelled words  */}
      {data.misspelled_words.length === 0 ? (
        <p>No misspelled words found.</p>
      ) : 
      // If there are misspelled words 
      (
        <ul>
          <h3>Mispelt Words</h3>
          {data.misspelled_words.map((word) => (
            <li key={word} className="result_item">
              <strong className="misspelled_word">{word}</strong>
              <span className="suggestions">
                {data.corrected_words[word]?.join(", ") || "No suggestions"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpellCheckResults;
