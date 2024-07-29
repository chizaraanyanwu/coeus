// Importing helper modules
import React, { useCallback, useMemo, useRef, useState } from "react";

// Importing core components
import QuillEditor from "react-quill";

// Importing userPage
import "react-quill/dist/quill.snow.css";
import userPage from "../css/userPage.module.css";


const Editor = () => {
  //Adds variables that control the split screen 
  const [isSplit, setIsSplit] = useState(false);
  const [spellCheckData, setSpellCheckData] = useState(null);

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
      //Problems here s
      const response = await fetch("http://localhost:5000/spellcheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8;",
        },
        body: JSON.stringify({ text: value }),
      });

      if (!response.ok) {
        throw new Error("Spell check failed");
      }

      const data = await response.json();
      setSpellCheckData(data);
      setIsSplit(true);

      const misspelledWords = data.misspelled_words;

      if (misspelledWords.length > 0) {
        // Implement your logic to handle misspelled words (e.g., highlight, alert, etc.)
        console.log("Misspelled words:" + misspelledWords.join(", "));
      } else {
        console.log("No misspelled words found.");
      }
    } catch (error) {
      console.error("Error during spell check:", error.message);
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

  const handleSubmit = () => {
    console.log("I think it works");
    // Call the spell check function when the "Submit" button is clicked
    handleSpellCheck();
    //Play sumbit animation too
    submitAnim();
  };

  return (
    <section
      className={`${userPage.wrapper} ${isSplit ? userPage.split : ""}`}>
      {/* The main content of the page  */}
      <div className={userPage.main_content}>
        {/* Essay prompt box  */}
        <div className={userPage.prompt}>
          <label className={userPage.prompt_label}>
            What's your essay about?
          </label>
          <input
            type="text"
            autocomplete="on"
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
          {/* Submit button  */}
          {/* <div className={userPage.wrapper}> */}
          <button onClick={handleSubmit} className={userPage.btn}>
            CHECK
          </button>
          {/* <div className="icon">✔️</div> */}
          {/* </div> */}
        </div>
      </div>
      {/* Split screen content  */}
      {isSplit && (
        <div className={userPage.side_panel}>
          <button onClick={handleClose} className={userPage.close_btn}>
            x
          </button>
          <div className={userPage.spellcheck_data}>
            <pre>{JSON.stringify(spellCheckData, null, 2)}</pre>
          </div>
        </div>
      )}
    </section>
  );
};

export default Editor;
