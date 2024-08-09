// Importing helper modules
import React, { useCallback, useMemo, useRef, useState } from "react";

// Importing core components
import QuillEditor from "react-quill";
// Importing userPage
import "react-quill/dist/quill.snow.css";
import userPage from "../css/userPage.module.css";
import SpellCheckResults from "../components/SpellCheckResults"; // Import the Spellcheck area component
import TextAnalysisResults from "../components/TextAnalysisResults.js";

const Editor = () => {
  //Adds variables that control the split screen 
  const [isSplit, setIsSplit] = useState(false);
  const [spellCheckData, setSpellCheckData] = useState(null);

  //Prediction model
  // const [text, setText] = useState("");
  const [prediction, setPrediction] = useState(null);


  // Editor state
  const [value, setValue] = useState("");

  // Editor ref
  const quill = useRef();

  //Toggler for split screen 
  const handleClose = () => {
    setIsSplit(false);
    setSpellCheckData(null);
  };

  // Handler to handle button clicked (work during cosmetics week)
  const submitAnim = useCallback(() => {
    try {
      // Choose the elements
      const button = document.querySelector(`.${userPage.btn}`);
      const icon = document.querySelector(`.${userPage.icon}`);

      // Ensure elements exist before adding classes
      button.classList.add("clicked");
      icon.classList.add("done");
    } catch (error) {
      console.error("Error while performing animation:", error.message);
    }
  }, []); // Dependency array is empty if no external dependencies are used

  // Function to handle spell check
  const handleSpellCheck = useCallback(async () => {
    try {
      //Idek what this does.... soemthing complex I'm guessing
      const response = await fetch("http://localhost:5000/spellcheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;",
        },
        body: JSON.stringify({ text: value }),
      });
      if (!response.ok) {
        throw new Error("Spell check failed");
      }

      const data = await response.json();
      setSpellCheckData(data);

      const misspelledWords = data.misspelled_words;

      // Splits the screen
      setIsSplit(true);

      if (misspelledWords.length > 0) {
        // Implement your logic to handle misspelled words (e.g., highlight, alert, etc.)
        console.log("Misspelled words:" + misspelledWords.join(", "));
      } else {
        console.log("No misspelled words found.");
      }
    } 
    catch (error) {
      console.error("Error during spell check:", error.message);
      // Splits the screen
      setIsSplit(true);
    }
  }, [value]);

  // Function to run the AI check 
  const textScoring = useCallback(async () => {
    try {
      //Idek what this does.... soemthing complex I'm guessing
      const response = await fetch("http://localhost:5000/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;",
        },
        body: JSON.stringify({ text: value }),
      });
      if (!response.ok) {
        throw new Error("Essay prediction failed... try something else girlie");
      }

      const data = await response.json();
      
      setPrediction(data.predicted_score);
      console.log(data);
    } catch (error) {
      console.error("Error during the ummmm thingy... oop:", error.message);
    }
  }, [value]);

  // Handling imported images 
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();

        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl);
      };

      reader.readAsDataURL(file);
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];

  // Controls what the button does on sumbit 
  const handleSubmit = () => {
    console.log("I think it works");
    //Play sumbit animation too
    submitAnim();
    //Run the text analysis $ scoring
    textScoring();
    // Call the spell check function when the "Submit" button is clicked
    handleSpellCheck();
  };

  return (
    <section className={`${userPage.wrapper} ${isSplit ? userPage.split : ""}`}>
      {/* The main content of the page  */}
      <div className={userPage.main_content}>
        {/* Essay prompt box  */}
        <div className={userPage.prompt}>
          <label className={userPage.prompt_label}>
            What's your essay about?
          </label>
          <input
            type="text"
            autoComplete="on"
            className={userPage.input}></input>
        </div>
        {/* All the quilljs text editor  */}
        <div>
          <label className={userPage.label}>Editor Content</label>
          <QuillEditor
            ref={(el) => (quill.current = el)}
            className={userPage.editor}
            theme="snow"
            value={value}
            formats={formats}
            modules={modules}
            onChange={setValue}
          />
          {/* <div className={userPage.wrapper}> */}
          {/* <div className="icon">✔️</div> */}
          {/* Submit button  */}
          <button onClick={handleSubmit} className={userPage.btn}>
            CHECK
          </button>
          {/* </div> */}
        </div>
      </div>
      {/* Split screen content  */}
      {isSplit && (
        <div className={userPage.side_panel}>
          {/* Closes the screen  */}
          <button onClick={handleClose} className={userPage.close_btn}>
            x
          </button>
          <TextAnalysisResults data={prediction} />
          {/* Spell check info  */}
          <div className={userPage.spellcheck_data}>
            <SpellCheckResults data={spellCheckData} />
            {/* Text prediction  */}
          </div>
        </div>
      )}
    </section>
  );
};

export default Editor;
