// SpellCheckResults.js
import React from "react";
import "../css/TextAnalysisResults.css"; // Import the CSS for styling

//The list showing all the spell check information
const TextAnalysisResults = ({ data }) => {
  return (
    <div className="text_analysis_results">
      {data.prediction === 0 ? (
        <p>No prediction yet</p> ) : (
      <div>
        <h3>Prediction Score</h3>
        <p className="prediction_score">{data}</p>
      </div>
      )}
    </div>
  );
};


export default TextAnalysisResults;
