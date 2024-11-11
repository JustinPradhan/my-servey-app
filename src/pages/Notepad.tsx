import React, { useRef } from "react";
import toast from "react-hot-toast";

const CustomEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const placeholders = editor.querySelectorAll<HTMLSpanElement>(".placeholder");
    const keyValuePairs: Record<string, string> = {};

    placeholders.forEach((placeholder) => {
      const key = placeholder.textContent?.trim() || "";

      let value = "";
      let node = placeholder.nextSibling;

      // Traverse through siblings to capture the entire text after the placeholder
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          value += node.textContent;
        } else {
          break; // Stop if we encounter another element node
        }
        node = node.nextSibling;
      }

      keyValuePairs[key] = value.trim();
    });

    console.log(JSON.stringify(keyValuePairs));
    alert("Saved: " + JSON.stringify(keyValuePairs));
  };

  const isInsidePlaceholder = (node: Node | null): boolean => {
    while (node && node !== editorRef.current) {
      if (node instanceof HTMLElement && node.childNodes.length > 0) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const endNode = range.endContainer;

    // Log the current nodes and their ancestors
   

    const startParent = startNode.parentNode as HTMLElement;
    const endParent = endNode.parentNode as HTMLElement;
    if (
      (event.key === "Backspace" || event.key === "Delete") &&
      ((startParent instanceof HTMLElement && startParent.classList.contains("placeholder")) ||
        (endParent instanceof HTMLElement && endParent.classList.contains("placeholder")))
    ) {
      console.log("Preventing deletion of placeholder.");
      event.preventDefault();
    }

    // Prevent typing directly into a placeholder
    if (
      (startParent instanceof HTMLElement && startParent.classList.contains("placeholder")) ||
      (endParent instanceof HTMLElement && endParent.classList.contains("placeholder"))
    ) {
      console.log("Preventing typing into placeholder.");
      event.preventDefault();
    }
  };

  return (
    <div>
      <div
        id="editor"
        ref={editorRef}
        contentEditable="true"
        onKeyDown={handleKeyDown}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "50px",
          fontFamily: "monospace",
          userSelect: "text", // Allows selecting text but not the placeholders
        }}
      >
         <span className="placeholder">
          name  :
        </span>{" "}
        Mr. John,{" "}
        <span className="placeholder">
          age 
        </span>{" "}
        12,{" "}
        <span className="placeholder">
          year 
        </span>{" "}
        2021
        <span className="placeholder">
          " "
        </span>{" "}
        2021
      </div>
      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Save
      </button>
    </div>
  );
};

export default CustomEditor;
