import React, { useState, useRef } from "react";
import { QuillEditor } from "your-quill-editor-component"; // Make sure to import your QuillEditor component
import userPage from "../css/userPage.module.css"; // Adjust import path as needed

const EssayPrompt = () => {
  const [value, setValue] = useState(""); // For Quill editor content
  const [prompt, setPrompt] = useState(""); // For the prompt input
  const [score, setScore] = useState(null); // For the predicted score
  const [error, setError] = useState(null); // For error handling

  const quill = useRef(null); // Ref for Quill editor

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          essay: value, // Essay content from Quill editor
          prompt: prompt, // Prompt input value
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setScore(data.score);
    } catch (error) {
      setError(error.message);
    }
  };

  
  return (
    <div>
      {/* Essay prompt box */}
      <div className={userPage.prompt}>
        <label className={userPage.prompt_label}>
          What's your essay about?
        </label>
        <input
          type="text"
          autoComplete="on"
          className={userPage.input}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      {/* All the Quill.js text editor */}
      <div>
        <label className={userPage.label}>Editor Content</label>
        <QuillEditor
          ref={quill}
          className={userPage.editor}
          theme="snow"
          value={value}
          // formats={formats} // Ensure these are defined elsewhere
          // modules={modules} // Ensure these are defined elsewhere
          onChange={setValue}
        />
      </div>
      {/* Submit button */}
      <button onClick={handleSubmit} className={userPage.btn}>
        CHECK
      </button>
      {/* Display result */}
      {score !== null && <p>Predicted Score: {score}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default EssayPrompt;
